import React, { useState, useEffect } from 'react';
import Navbar, { CATEGORIES } from '../components/Navbar';
import BookCard from '../components/BookCard';
import BookDetailModal from '../components/BookDetailModal';
import CartDrawer from '../components/CartDrawer';
import { subscribeBooks, seedSampleDataToFirestore } from '../services/bookService';
import { useToast } from '../context/ToastContext';
import { 
  BookOpen, 
  Sparkles, 
  SlidersHorizontal, 
  RefreshCw, 
  Truck, 
  ShieldCheck, 
  Star, 
  Award, 
  ArrowRight,
  Zap
} from 'lucide-react';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [activeBook, setActiveBook] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const unsubscribe = subscribeBooks((data) => {
      setBooks(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSeedBooks = async () => {
    setLoading(true);
    await seedSampleDataToFirestore();
    addToast('Sample books catalog populated!', 'success');
    setLoading(false);
  };

  const filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    const matchesSearch = 
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Dynamic Navbar */}
      <Navbar
        searchSearchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Banner Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-20 border-b border-slate-800">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider bg-slate-900 border border-amber-500/30 text-amber-400 shadow-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Premier Online Bookstore Experience</span>
              </div>

              <h1 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                Immerse Yourself in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">Timeless Knowledge</span> & Fiction.
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Browse our curated catalog across Academic, Fiction, Islamic, and Technology literature. Enjoy instant nationwide dispatches with Cash on Delivery guarantee.
              </p>

              {/* Value Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Free Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Genuine Editions</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Curated Bestsellers</span>
                </div>
              </div>
            </div>

            {/* Right Hero Feature Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative rounded-3xl bg-gradient-to-tr from-slate-900 to-slate-800 p-8 border border-slate-700/80 shadow-2xl space-y-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Today's Highlight</h4>
                      <p className="text-xs text-amber-400 font-semibold">Featured Selection</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    In Stock
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
                    alt="Featured book"
                    className="w-24 h-32 object-cover rounded-xl shadow-lg border border-slate-600"
                  />
                  <div className="space-y-1.5">
                    <h5 className="font-serif-heading font-bold text-lg text-white">The Alchemist</h5>
                    <p className="text-xs text-slate-400">by Paulo Coelho</p>
                    <div className="flex items-center gap-1 text-amber-400 text-xs pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <span className="ml-1 text-slate-300 font-bold text-[11px]">(4.9/5)</span>
                    </div>
                    <span className="text-lg font-black text-amber-400 block pt-1">$14.99</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Store Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        
        {/* Category Controls Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? books.length : books.filter(b => b.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    selectedCategory === cat
                      ? 'bg-slate-950 text-amber-400 shadow-lg shadow-slate-950/20 scale-105 border border-slate-800'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    selectedCategory === cat ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs cursor-pointer"
            >
              <option value="newest">Sort: Newest Arrivals</option>
              <option value="price-low">Sort: Price (Low to High)</option>
              <option value="price-high">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Filter State Banner */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-950 px-5 py-3 rounded-2xl text-xs font-semibold shadow-2xs">
            <span>
              Showing results for{' '}
              {selectedCategory !== 'All' && <strong className="text-amber-700">"{selectedCategory}" </strong>}
              {searchQuery && <strong className="text-amber-700">Keyword: "{searchQuery}"</strong>}
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-amber-800 underline hover:text-amber-950 font-bold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Loading Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 border border-slate-200 animate-pulse space-y-4 shadow-sm">
                <div className="aspect-[3/4] bg-slate-200 rounded-2xl w-full" />
                <div className="h-5 bg-slate-200 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-200 rounded-lg w-1/2" />
                <div className="h-10 bg-slate-200 rounded-2xl w-full pt-4" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-200">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-serif-heading text-xl font-bold text-slate-800">No books found</h3>
            <p className="text-xs text-slate-500">
              No titles matched your current search parameters.
            </p>
            {books.length === 0 ? (
              <button
                onClick={handleSeedBooks}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Populate Sample Bookstore Collection
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-6 py-3 rounded-2xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          /* Books Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpenDetails={(selectedBook) => setActiveBook(selectedBook)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-white font-bold text-lg font-serif-heading">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <span>BookVerse</span>
          </div>
          <p>© {new Date().getFullYear()} BookVerse Online Storefront. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Crafted with React, Tailwind CSS, & Firebase
          </p>
        </div>
      </footer>

      {/* Modals */}
      {activeBook && (
        <BookDetailModal
          book={activeBook}
          onClose={() => setActiveBook(null)}
        />
      )}

      <CartDrawer />
    </div>
  );
}
