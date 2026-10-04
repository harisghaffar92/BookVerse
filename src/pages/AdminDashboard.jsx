import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  subscribeBooks, 
  addBookToDB, 
  updateBookInDB, 
  deleteBookFromDB, 
  subscribeOrders, 
  updateOrderStatusInDB,
  seedSampleDataToFirestore
} from '../services/bookService';
import { CATEGORIES } from '../components/Navbar';
import { 
  BookOpen, 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  Upload, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Phone, 
  MapPin, 
  FileText,
  User,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Layers,
  Search,
  Check,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'orders'

  // Books State
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [bookSearch, setBookSearch] = useState('');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Book Form State
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    price: '',
    description: '',
    coverImageURL: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isSubmittingBook, setIsSubmittingBook] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');

  // Subscribe to Firestore Books & Orders
  useEffect(() => {
    const unsubBooks = subscribeBooks((data) => {
      setBooks(data);
      setLoadingBooks(false);
    });

    const unsubOrders = subscribeOrders((data) => {
      setOrders(data);
      setLoadingOrders(false);
    });

    return () => {
      unsubBooks();
      unsubOrders();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    addToast('Signed out of admin dashboard', 'info');
    navigate('/admin/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setBookForm({
      title: '',
      author: '',
      category: 'Fiction',
      price: '',
      description: '',
      coverImageURL: '',
    });
    setSelectedFile(null);
    setFilePreview('');
    setEditingBook(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddBookModalOpen(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      category: book.category || 'Fiction',
      price: book.price || '',
      description: book.description || '',
      coverImageURL: book.coverImageURL || '',
    });
    setFilePreview(book.coverImageURL || '');
    setSelectedFile(null);
    setIsAddBookModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();

    if (!bookForm.title || !bookForm.price || !bookForm.author) {
      addToast('Please fill in title, author, and price.', 'error');
      return;
    }

    setIsSubmittingBook(true);

    try {
      if (editingBook) {
        await updateBookInDB(editingBook.id, bookForm, selectedFile);
        addToast(`Updated book "${bookForm.title}" successfully!`, 'success');
      } else {
        await addBookToDB(bookForm, selectedFile);
        addToast(`Added new book "${bookForm.title}" to inventory!`, 'success');
      }

      setIsAddBookModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error saving book:', err);
      addToast('Failed to save book record.', 'error');
    } finally {
      setIsSubmittingBook(false);
    }
  };

  const handleDeleteBook = async (bookId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBookFromDB(bookId);
        addToast(`Deleted "${title}" from inventory`, 'info');
      } catch (err) {
        console.error('Error deleting book:', err);
        addToast('Failed to delete book.', 'error');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusInDB(orderId, newStatus);
      addToast(`Order ${orderId.slice(0, 8)} status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Error updating status:', err);
      addToast('Failed to update order status.', 'error');
    }
  };

  const handleSeedBooksClick = async () => {
    setLoadingBooks(true);
    await seedSampleDataToFirestore();
    addToast('Sample book catalog populated!', 'success');
    setLoadingBooks(false);
  };

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  const filteredBooks = books.filter(b => 
    b.title?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author?.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.category?.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer?.phone?.includes(orderSearch)
  );

  const categoriesList = ['Fiction', 'Non-Fiction', 'Academic', 'Islamic', 'Technology', 'Children'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Top Bar Header */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-serif-heading text-xl font-bold text-white flex items-center gap-2">
                BookVerse Executive Portal
              </h1>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-amber-400 font-bold">{currentUser?.email || 'harisghaffar@admin.com'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors border border-slate-700/60"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-semibold text-xs border border-rose-800/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* KPI Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Revenue */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Sales (COD)</span>
              <h3 className="font-serif-heading text-2xl font-black text-amber-400">${totalRevenue.toFixed(2)}</h3>
              <p className="text-[11px] text-slate-500">From {orders.length} total orders</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</span>
              <h3 className="font-serif-heading text-2xl font-black text-emerald-400">{pendingOrdersCount}</h3>
              <p className="text-[11px] text-slate-500">Awaiting shipment</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Books Inventory */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Book Inventory</span>
              <h3 className="font-serif-heading text-2xl font-black text-white">{books.length}</h3>
              <p className="text-[11px] text-slate-500">Active catalog items</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-3xl shadow-xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Categories</span>
              <h3 className="font-serif-heading text-2xl font-black text-white">{categoriesList.length}</h3>
              <p className="text-[11px] text-slate-500">Fiction, Academic, Islamic & more</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Selection Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Book Catalog ({books.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-xs transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'inventory' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSeedBooksClick}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold border border-slate-800 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Seed Sample Books</span>
              </button>

              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Book</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            {/* Search Input for Inventory */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Filter inventory by title, author, or category..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {loadingBooks ? (
              <div className="p-12 text-center text-slate-400">Loading catalog...</div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-4">
                <Package className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="font-serif-heading text-lg font-bold text-white">No books match your search</h3>
                <button
                  onClick={handleSeedBooksClick}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
                >
                  Populate Seed Books
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="py-4 px-6">Cover</th>
                        <th className="py-4 px-6">Title & Author</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-6">
                            <img
                              src={book.coverImageURL || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-xl shadow-md bg-slate-800"
                            />
                          </td>
                          <td className="py-3 px-6 max-w-xs">
                            <div className="font-bold text-white text-sm line-clamp-1">{book.title}</div>
                            <div className="text-slate-400 text-xs">by {book.author || 'Unknown'}</div>
                          </td>
                          <td className="py-3 px-6">
                            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-slate-950 text-amber-300 border border-slate-800">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-3 px-6 font-black text-white text-sm">
                            ${Number(book.price).toFixed(2)}
                          </td>
                          <td className="py-3 px-6 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(book)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-400 transition-colors cursor-pointer"
                              title="Edit Book"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id, book.title)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                              title="Delete Book"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Search Input for Orders */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search orders by customer name, order ID, or phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center text-slate-400">Loading incoming orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-4">
                <ShoppingBag className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="font-serif-heading text-lg font-bold text-white">No customer orders found</h3>
              </div>
            ) : (
              <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-extrabold border-b border-slate-800">
                      <tr>
                        <th className="py-4 px-6">Order Reference</th>
                        <th className="py-4 px-6">Customer Information</th>
                        <th className="py-4 px-6">Items Ordered</th>
                        <th className="py-4 px-6">Total COD Cash</th>
                        <th className="py-4 px-6">Order Status Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4 px-6 align-top">
                            <span className="font-mono font-bold text-white block text-sm">#{order.id.slice(0, 8)}</span>
                            <span className="text-[11px] text-slate-500">
                              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                            </span>
                          </td>

                          <td className="py-4 px-6 align-top space-y-1">
                            <div className="font-bold text-white text-sm flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-amber-400" />
                              {order.customer?.name || 'Guest'}
                            </div>
                            <div className="text-slate-400 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-500" />
                              {order.customer?.phone}
                            </div>
                            <div className="text-slate-400 flex items-start gap-1.5 max-w-xs">
                              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                              <span>{order.customer?.address}</span>
                            </div>
                            {order.customer?.instructions && (
                              <div className="text-[11px] text-amber-400/80 italic flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                "{order.customer.instructions}"
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-6 align-top">
                            <ul className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <li key={idx} className="text-slate-200">
                                  <span className="font-extrabold text-amber-400">{item.quantity}×</span> {item.title}
                                  <span className="text-slate-500 ml-1">(${(item.price * item.quantity).toFixed(2)})</span>
                                </li>
                              ))}
                            </ul>
                          </td>

                          <td className="py-4 px-6 align-top font-black text-amber-400 text-base">
                            ${Number(order.totalAmount).toFixed(2)}
                            <span className="block text-[10px] text-slate-500 font-medium uppercase">Cash on Delivery</span>
                          </td>

                          <td className="py-4 px-6 align-top">
                            <div className="space-y-2">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                                  : order.status === 'Shipped'
                                  ? 'bg-amber-950 text-amber-400 border-amber-800'
                                  : 'bg-slate-950 text-slate-300 border-slate-800'
                              }`}>
                                {order.status === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                {order.status === 'Shipped' && <Truck className="w-3.5 h-3.5" />}
                                {order.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                {order.status || 'Pending'}
                              </span>

                              <select
                                value={order.status || 'Pending'}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className="block w-full bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Book Modal */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-serif-heading text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                {editingBook ? 'Edit Book Information' : 'Add New Book to Store'}
              </h3>
              <button
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Great Gatsby"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. F. Scott Fitzgerald"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="19.99"
                    value={bookForm.price}
                    onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={bookForm.category}
                  onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Description / Overview
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter book overview..."
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Book Cover Image (Firebase Storage Upload)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-slate-700 hover:border-amber-500 bg-slate-950 cursor-pointer text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{selectedFile ? selectedFile.name : 'Choose File...'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {filePreview && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-12 h-16 object-cover rounded-lg border border-slate-700"
                    />
                  )}
                </div>
                
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="Or paste Cover Image URL"
                    value={bookForm.coverImageURL}
                    onChange={(e) => {
                      setBookForm({ ...bookForm, coverImageURL: e.target.value });
                      if (!selectedFile) setFilePreview(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingBook}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {isSubmittingBook ? 'Saving...' : editingBook ? 'Save Changes' : 'Publish Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
