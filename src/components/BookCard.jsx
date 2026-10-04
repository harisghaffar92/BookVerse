import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, User, Bookmark } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BookCard({ book, onOpenDetails }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-amber-400/60 transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1">
      
      {/* Category Pill Badge */}
      <div className="absolute top-3.5 left-3.5 z-10">
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-950/85 backdrop-blur-md text-amber-300 border border-slate-700/60 shadow-md">
          {book.category || 'General'}
        </span>
      </div>

      {/* Book Cover Container */}
      <div 
        onClick={() => onOpenDetails(book)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={imgError || !book.coverImageURL ? fallbackImage : book.coverImageURL}
          alt={book.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Hover Quick View Button */}
        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[3px] flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(book);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-2xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-amber-400 hover:text-slate-950 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-amber-600 group-hover:text-slate-950" />
            <span>Explore Details</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            onClick={() => onOpenDetails(book)}
            className="font-serif-heading text-lg font-bold text-slate-900 line-clamp-1 hover:text-amber-600 transition-colors cursor-pointer"
            title={book.title}
          >
            {book.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <User className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate font-semibold text-slate-700">{book.author || 'Unknown Author'}</span>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {book.description || 'No detailed synopsis provided.'}
          </p>
        </div>

        {/* Footer: Price & Add Button */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
            <span className="text-xl font-black text-slate-900">
              ${Number(book.price).toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(book)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
