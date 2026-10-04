import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, BookOpen, Tag, User, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookDetailModal({ book, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!book) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';

  const handleAddToCart = () => {
    addToCart(book, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200/80 animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Cover Image */}
          <div className="md:col-span-5 bg-slate-900 p-6 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
              <img
                src={imgError || !book.coverImageURL ? fallbackImage : book.coverImageURL}
                alt={book.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {book.category || 'General'}
            </span>
          </div>

          {/* Right Column: Book Details */}
          <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold tracking-wider text-amber-600 uppercase block mb-1">
                Book Details
              </span>
              <h2 className="font-serif-heading text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {book.title}
              </h2>
              
              <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
                <User className="w-4 h-4 text-amber-600" />
                <span>Written by <strong className="text-slate-900">{book.author || 'Unknown Author'}</strong></span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Synopsis / Description
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed max-h-44 overflow-y-auto pr-2">
                  {book.description || 'No detailed description available for this title.'}
                </p>
              </div>
            </div>

            {/* Pricing & Quantity Selector */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Price per copy</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ${Number(book.price).toFixed(2)}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-xs transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add {quantity} to Cart • ${(Number(book.price) * quantity).toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
