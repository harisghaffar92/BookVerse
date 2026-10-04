import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrderInDB } from '../services/bookService';
import { useToast } from '../context/ToastContext';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  User, 
  FileText,
  PackageCheck
} from 'lucide-react';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const cartTotal = getCartTotal();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      addToast('Please fill out all required customer information.', 'error');
      return;
    }

    if (cart.length === 0) {
      addToast('Your cart is empty!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        instructions: formData.instructions.trim(),
        items: cart,
        totalAmount: cartTotal,
      };

      const createdOrder = await createOrderInDB(orderPayload);
      clearCart();
      setCompletedOrder(createdOrder);
      addToast('Order submitted successfully! Payment to be collected on delivery.', 'success');
    } catch (err) {
      console.error('Order placement failed:', err);
      addToast('Failed to submit order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200/80 text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
            <PackageCheck className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
              Order Confirmed
            </span>
            <h1 className="font-serif-heading text-2xl font-bold text-slate-900">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Your Cash on Delivery order has been received and is being prepared.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200/70 pb-2">
              <span className="text-slate-500 font-medium">Order Reference ID:</span>
              <strong className="text-slate-900 font-mono font-bold">{completedOrder.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Customer Name:</span>
              <span className="text-slate-900 font-semibold">{completedOrder.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Delivery Address:</span>
              <span className="text-slate-900 font-semibold truncate max-w-[200px]">{completedOrder.customer.address}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/70 pt-2 text-sm">
              <span className="text-slate-700 font-bold">Total Cash to Pay:</span>
              <span className="text-amber-600 font-extrabold">${completedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex flex-col items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-heading text-xl font-bold text-slate-800">Your cart is empty</h2>
          <p className="text-xs text-slate-500">
            Please add books to your shopping cart before proceeding to checkout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>
          <span className="font-serif-heading text-lg font-bold text-slate-900">
            Guest Checkout (COD)
          </span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Order
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Delivery Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                Shipping & Delivery Details
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your contact info for Cash on Delivery dispatch.
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              
              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +1 (555) 234-5678"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Address Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  Complete Shipping Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  placeholder="House/Apartment #, Street name, City, Zip Code"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-none"
                />
              </div>

              {/* Instructions Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Delivery Instructions / Notes (Optional)
                </label>
                <input
                  type="text"
                  name="instructions"
                  placeholder="e.g. Leave with gate guard or call upon arrival"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              {/* Payment Method Option */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                      COD
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-amber-950">Cash on Delivery</h4>
                      <p className="text-xs text-amber-800">Pay cash directly to courier upon book receipt</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-amber-600" />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <span>Confirm COD Order • ${cartTotal.toFixed(2)}</span>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs h-fit space-y-6">
            <h3 className="font-serif-heading text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary ({cart.length} books)
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.bookId} className="flex gap-3 text-xs border-b border-slate-100 pb-3">
                  <img
                    src={item.coverImageURL || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800'}
                    alt={item.title}
                    className="w-12 h-16 object-cover rounded-md shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="font-bold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-emerald-600">Free COD Shipping</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total Due on Delivery</span>
                <span className="text-amber-600 text-base">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
