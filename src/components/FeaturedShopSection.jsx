import React, { useState, useCallback, useMemo } from 'react';
import { PRODUCTS } from '../../src/utils/data';
import { ArrowRight, Plus, X, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedShopSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState('shop');

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }, []);

  const removeItem = useCallback((id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <>
      <section className="py-16 md:py-24 relative ">
        {/* Cart Floating Button */}
        <div className="fixed bottom-5 right-20 z-50">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-14 h-14 bg-blue-600  rounded-full shadow-lg flex items-center justify-center text-white relative transition-all duration-300 hover:scale-105"
            aria-label="View cart"
          >
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
       <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
             <div className="mb-4 md:mb-0">
                <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Official Gear</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Get Competition Ready</h2>
             </div>
             <Link 
               to="/shop" 
               className="inline-flex items-center text-sm font-medium  transition-colors group"
             >
               Visit Store <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {PRODUCTS.slice(0,4).map((product) => (
                <div key={product.id} className="group cursor-pointer transition-transform hover:-translate-y-1">
                   <div className="relative bg-slate-800/50 rounded-xl overflow-hidden mb-4 border border-slate-700/50 group-hover:border-red-500/50 transition-all duration-300">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          loading="lazy"
                        />
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-slate-900/80 hover:bg-red-600 rounded-full backdrop-blur-sm flex items-center justify-center text-white hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                        aria-label="Add to cart"
                      >
                        <Plus size={20} />
                      </button>
                   </div>
                   <div className="text-xs text-black font-semibold uppercase tracking-wider mb-1">{product.category}</div>
                   <h3 className="font-bold mb-1 leading-tight text-black line-clamp-2 h-12">{product.name}</h3>
                   <div className="flex justify-between items-center">  
                    <span className="text-blue-600 font-bold text-lg">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1"
                    >
                      <Plus size={14} />
                      <span>Add To Cart</span>
                    </button>
                   </div>
                </div>
             ))}
          </div>
       </div>
      </section>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
            aria-hidden="true"
          />
          
          {/* Cart Panel */}
          <div className="relative w-full max-w-md bg-gray-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-800">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-oswald uppercase tracking-wider">
                <div className="w-8 h-8 bg-red-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                Your Cart
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 -mr-2 hover:bg-gray-800 rounded-full"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600 border border-gray-700">
                    <ShoppingCart size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-400 text-sm">Add some items to get started</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 hover:bg-gray-800/50 rounded-lg transition-all border border-transparent hover:border-gray-700">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-red-500 text-base">${item.price.toFixed(2)}</div>
                        <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-2 py-1 border border-gray-700">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)} 
                            disabled={item.quantity <= 1} 
                            className="p-1 text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-white">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-gray-500 hover:text-red-500 self-start p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-800">
                <div className="flex justify-between items-center text-white font-bold text-lg mb-6">
                  <span>Total</span>
                  <span className="text-xl text-red-500">${subtotal.toFixed(2)}</span>
                </div>
                <Link 
                  to="/checkout"
                  className="block w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md text-center transition-all hover:shadow-lg hover:shadow-red-900/30"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default FeaturedShopSection;