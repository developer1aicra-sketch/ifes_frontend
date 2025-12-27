import { ArrowRight, Minus, Plus, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * CartDrawer - A sliding panel component that displays the shopping cart with dark theme
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the drawer
 * @param {Function} props.onClose - Callback when the drawer is closed
 * @param {Array} props.cartItems - Array of items in the cart
 * @param {Function} props.updateQuantity - Function to update item quantity
 * @param {Function} props.removeItem - Function to remove an item from cart
 */
export const CartDrawer = ({ isOpen, onClose, cartItems, updateQuantity, removeItem }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end font-sans">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Cart Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            Your Cart
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-700 transition-colors p-1.5 hover:bg-gray-100 rounded-full"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 border-2 border-dashed border-blue-200">
                <ShoppingCart size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet</p>
              <Link 
                to="/shop"
                onClick={onClose}
                className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all hover:shadow-md"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 hover:bg-blue-50/50 rounded-lg transition-all border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                  <p className="text-gray-500 text-xs mb-2 uppercase tracking-wider">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-blue-600 text-base">${item.price.toFixed(2)}</div>
                    <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 border border-gray-200">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        disabled={item.quantity <= 1} 
                        className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center text-gray-800">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="text-gray-400 hover:text-blue-600 self-start p-1 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center text-gray-900 font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-xl text-blue-600">${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-md"
            >
              Proceed to Checkout
              <ArrowRight size={18} className="mt-0.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};