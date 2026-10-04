import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, BookOpen, ShieldCheck, X, Sparkles, Compass, Feather } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Academic', 'Islamic', 'Technology', 'Children'];

export default function Navbar({ searchSearchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const { getItemCount, getCartTotal, setIsCartOpen } = useCart();
  const { currentUser } = useAuth();
  const itemCount = getItemCount();
  const cartTotal = getCartTotal();
  const location = useLocation();

  const isStorefront = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Stunning Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 shrink-0 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <BookOpen className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-serif-heading text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  BookVerse
                </span>
                <Feather className="w-4 h-4 text-amber-500 hidden sm:inline" />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400/90 uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Curated Literary Haven
              </span>
            </div>
          </Link>

          {/* Search Bar (Storefront) */}
          {isStorefront && (
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or keyword..."
                  value={searchSearchQuery || ''}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 focus:bg-slate-900 transition-all shadow-inner"
                />
                {searchSearchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Navigation Right */}
          <div className="flex items-center gap-3.5">
            
            {/* Seller/Admin Link */}
            {currentUser ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 transition-all shadow-md group"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 transition-all shadow-sm group"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Seller Login</span>
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-95 cursor-pointer"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-slate-950 text-amber-400 text-[11px] font-black px-2 py-0.5 rounded-full border border-amber-500/40">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {isStorefront && (
          <div className="pb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchSearchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {searchSearchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
