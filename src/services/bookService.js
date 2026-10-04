import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../firebase';

// Initial sample books with Unsplash high quality cover images
export const SAMPLE_BOOKS = [
  {
    id: 'sample-1',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    price: 14.99,
    description: 'A magical story about following your dreams. Santiago, an Andalusian shepherd boy, longs to travel in search of a worldly treasure as extravagant as any ever found.',
    coverImageURL: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-2',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    category: 'Academic',
    price: 39.95,
    description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code.',
    coverImageURL: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-3',
    title: 'The Sealed Nectar (Ar-Raheeq Al-Makhtum)',
    author: 'Safi-ur-Rahman al-Mubarakpuri',
    category: 'Islamic',
    price: 24.50,
    description: 'A complete authoritative book on the life of Prophet Muhammad (S.A.W.) which was honored by the World Muslim League as the first prize winner book.',
    coverImageURL: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-4',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Non-Fiction',
    price: 18.99,
    description: 'An easy and proven way to build good habits and break bad ones. Tiny changes, remarkable results in personal development and productivity.',
    coverImageURL: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-5',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Academic',
    price: 44.99,
    description: 'The definitive guide to architecture, reliability, scalability, and maintainability of modern web data systems and distributed databases.',
    coverImageURL: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sample-6',
    title: 'Reclaim Your Heart',
    author: 'Yasmin Mogahed',
    category: 'Islamic',
    price: 19.99,
    description: 'A guide to freedom from life’s fetters. Reclaim Your Heart is about freeing the heart from the slavery of this world.',
    coverImageURL: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  }
];

// Helper to get local demo storage
const getLocalBooks = () => {
  try {
    const data = localStorage.getItem('bookstore_demo_books');
    if (!data) {
      localStorage.setItem('bookstore_demo_books', JSON.stringify(SAMPLE_BOOKS));
      return SAMPLE_BOOKS;
    }
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_BOOKS;
  }
};

const saveLocalBooks = (books) => {
  try {
    localStorage.setItem('bookstore_demo_books', JSON.stringify(books));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
  window.dispatchEvent(new Event('bookstore_local_books_updated'));
};

const getLocalOrders = () => {
  try {
    const data = localStorage.getItem('bookstore_demo_orders');
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  try {
    localStorage.setItem('bookstore_demo_orders', JSON.stringify(orders));
  } catch (e) {
    console.error('LocalStorage order write error:', e);
  }
  window.dispatchEvent(new Event('bookstore_local_orders_updated'));
};

// Image Upload Helper with Timeout & DataURL Fallback
export const uploadBookCover = async (file) => {
  if (!file) return '';
  
  // Convert to Data URL directly if Firebase is not fully configured or if file is uploaded offline
  const convertToDataURL = () => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  if (!isFirebaseConfigured) {
    return convertToDataURL();
  }

  try {
    // 4-second timeout race condition so uploadBytes never hangs indefinitely!
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout')), 4000)
    );

    const storageRef = ref(storage, `book_covers/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytes(storageRef, file);
    
    const snapshot = await Promise.race([uploadTask, timeoutPromise]);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (err) {
    console.warn('Firebase Storage upload failed or timed out, using instant Data URL fallback:', err);
    return convertToDataURL();
  }
};

// Books Collection Operations
export const fetchBooksFromDB = async () => {
  if (!isFirebaseConfigured) {
    return getLocalBooks();
  }

  try {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return getLocalBooks();
    }
    return querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
  } catch (error) {
    console.error('Error fetching books from Firestore:', error);
    return getLocalBooks();
  }
};

export const subscribeBooks = (onUpdate) => {
  const handleLocalUpdate = () => {
    onUpdate(getLocalBooks());
  };

  window.addEventListener('bookstore_local_books_updated', handleLocalUpdate);

  if (!isFirebaseConfigured) {
    onUpdate(getLocalBooks());
    return () => {
      window.removeEventListener('bookstore_local_books_updated', handleLocalUpdate);
    };
  }

  try {
    const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        onUpdate(getLocalBooks());
      } else {
        const books = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        onUpdate(books);
      }
    }, (error) => {
      console.warn('Firestore subscription fallback:', error);
      onUpdate(getLocalBooks());
    });

    return () => {
      unsub();
      window.removeEventListener('bookstore_local_books_updated', handleLocalUpdate);
    };
  } catch (err) {
    onUpdate(getLocalBooks());
    return () => {
      window.removeEventListener('bookstore_local_books_updated', handleLocalUpdate);
    };
  }
};

export const addBookToDB = async (bookData, imageFile) => {
  let coverImageURL = bookData.coverImageURL || '';
  if (imageFile) {
    coverImageURL = await uploadBookCover(imageFile);
  }

  const newBook = {
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    description: bookData.description.trim(),
    price: Number(bookData.price),
    category: bookData.category || 'Fiction',
    coverImageURL: coverImageURL || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    createdAt: new Date().toISOString()
  };

  // Update local storage first for instant real-time UI refresh
  const current = getLocalBooks();
  const created = { id: `local-${Date.now()}`, ...newBook };
  saveLocalBooks([created, ...current]);

  if (!isFirebaseConfigured) {
    return created;
  }

  try {
    const docRef = await addDoc(collection(db, 'books'), {
      ...newBook,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...newBook };
  } catch (error) {
    console.error('Error adding book to Firestore:', error);
    return created;
  }
};

export const updateBookInDB = async (bookId, updatedFields, imageFile) => {
  let coverImageURL = updatedFields.coverImageURL || '';
  if (imageFile) {
    coverImageURL = await uploadBookCover(imageFile);
  }

  const updatePayload = {
    title: updatedFields.title.trim(),
    author: updatedFields.author.trim(),
    description: updatedFields.description.trim(),
    price: Number(updatedFields.price),
    category: updatedFields.category,
    ...(coverImageURL ? { coverImageURL } : {})
  };

  // Always update local storage first so UI refreshes INSTANTLY without page reload!
  const current = getLocalBooks();
  const updated = current.map((b) => (b.id === bookId ? { ...b, ...updatePayload } : b));
  saveLocalBooks(updated);

  if (!isFirebaseConfigured || bookId.startsWith('sample-') || bookId.startsWith('local-')) {
    return;
  }

  try {
    const bookRef = doc(db, 'books', bookId);
    await updateDoc(bookRef, updatePayload);
  } catch (error) {
    console.error('Error updating book in Firestore:', error);
  }
};

export const deleteBookFromDB = async (bookId) => {
  // Update local storage first for instant UI refresh
  const current = getLocalBooks();
  const filtered = current.filter((b) => b.id !== bookId);
  saveLocalBooks(filtered);

  if (!isFirebaseConfigured || bookId.startsWith('sample-') || bookId.startsWith('local-')) {
    return;
  }

  try {
    const bookRef = doc(db, 'books', bookId);
    await deleteDoc(bookRef);
  } catch (error) {
    console.error('Error deleting book from Firestore:', error);
  }
};

// Orders Collection Operations
export const createOrderInDB = async (orderData) => {
  const newOrder = {
    customer: {
      name: orderData.name,
      phone: orderData.phone,
      address: orderData.address,
      instructions: orderData.instructions || ''
    },
    items: orderData.items.map((item) => ({
      bookId: item.bookId,
      title: item.title,
      price: item.price,
      quantity: item.quantity
    })),
    totalAmount: Number(orderData.totalAmount),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  const currentOrders = getLocalOrders();
  const created = { id: `order-${Date.now().toString().slice(-6)}`, ...newOrder };
  saveLocalOrders([created, ...currentOrders]);

  if (!isFirebaseConfigured) {
    return created;
  }

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...newOrder,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...newOrder };
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    return created;
  }
};

export const subscribeOrders = (onUpdate) => {
  const handleLocalOrdersUpdate = () => {
    onUpdate(getLocalOrders());
  };

  window.addEventListener('bookstore_local_orders_updated', handleLocalOrdersUpdate);

  if (!isFirebaseConfigured) {
    onUpdate(getLocalOrders());
    return () => {
      window.removeEventListener('bookstore_local_orders_updated', handleLocalOrdersUpdate);
    };
  }

  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let formattedDate = data.createdAt;
        if (data.createdAt?.toDate) {
          formattedDate = data.createdAt.toDate().toISOString();
        }
        return {
          id: docSnap.id,
          ...data,
          createdAt: formattedDate || new Date().toISOString()
        };
      });
      onUpdate(orders);
    }, (error) => {
      console.warn('Orders subscription fallback:', error);
      onUpdate(getLocalOrders());
    });

    return () => {
      unsub();
      window.removeEventListener('bookstore_local_orders_updated', handleLocalOrdersUpdate);
    };
  } catch (err) {
    onUpdate(getLocalOrders());
    return () => {
      window.removeEventListener('bookstore_local_orders_updated', handleLocalOrdersUpdate);
    };
  }
};

export const updateOrderStatusInDB = async (orderId, newStatus) => {
  const currentOrders = getLocalOrders();
  const updated = currentOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  saveLocalOrders(updated);

  if (!isFirebaseConfigured || orderId.startsWith('order-')) {
    return;
  }

  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
  }
};

export const seedSampleDataToFirestore = async () => {
  saveLocalBooks(SAMPLE_BOOKS);

  if (!isFirebaseConfigured) {
    return SAMPLE_BOOKS;
  }

  try {
    const promises = SAMPLE_BOOKS.map((book) => {
      const { id, ...data } = book;
      return addDoc(collection(db, 'books'), {
        ...data,
        createdAt: serverTimestamp()
      });
    });
    await Promise.all(promises);
    return await fetchBooksFromDB();
  } catch (error) {
    console.error('Error seeding data to Firestore:', error);
    return SAMPLE_BOOKS;
  }
};
