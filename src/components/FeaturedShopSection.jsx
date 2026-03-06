import React, { useState, useCallback, useMemo } from 'react';
import { PRODUCTS } from '../../src/utils/data';
import { ArrowRight, Plus, X, ShoppingCart, ShoppingBag, Minus, ArrowLeft, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedShopSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState('shop');
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const closeProductModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleProductClick = useCallback((product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
  }, []);

  const getRelatedProducts = useCallback((currentProduct) => {
    if (!currentProduct) return [];
    return PRODUCTS
      .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
      .slice(0, 2);
  }, []);

  return (
    <>
      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4" onClick={closeProductModal}>
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button 
                onClick={closeProductModal}
                className="absolute -right-1 -top-1 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors z-10"
                aria-label="Close product details"
              >
                <XCircle className="w-8 h-8 text-gray-600" />
              </button>
              <div className="grid md:grid-cols-2 gap-6 p-6">
                <div className="bg-gray-50 rounded-xl overflow-hidden max-h-[400px]">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="py-2">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                  <div className="text-xl font-semibold text-blue-600 mb-4">${selectedProduct.price.toFixed(2)}</div>
                  <p className="text-gray-600 mb-6">
                    {selectedProduct.description || 'No description available for this product.'}
                  </p>
                  <div className="flex items-center space-x-4 mb-6 hidden">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQuantity(selectedProduct.id, -1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 w-12 text-center">
                        {cartItems.find(item => item.id === selectedProduct.id)?.quantity || 1}
                      </span>
                      <button 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => updateQuantity(selectedProduct.id, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductModal();
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Add to Cart
                    </button>
                  </div>
                  
                  {/* Related Products */}
                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">You may also like</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {getRelatedProducts(selectedProduct).map((product) => (
                        <div 
                          key={product.id} 
                          className="group cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                        >
                          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="px-1">
                            <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h4>
                            <div className="text-blue-600 font-semibold text-sm">${product.price.toFixed(2)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="py-16 md:py-24 relative bg-white hidden">
        {/* Cart Floating Button */}
        <div className="fixed bottom-5 right-20 z-50 hidden">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-14 h-14 bg-blue-600  rounded-full shadow-lg flex items-center justify-center text-white relative transition-all duration-300 hover:scale-105"
            aria-label="View cart"
          >
            <ShoppingCart size={22} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
       <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
             <div className="mb-4 md:mb-0">
                <span className="text-blue-600 font-bold tracking-widest text-xs uppercase">Official Gear</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Get Competition Ready</h2>
             </div>
             <Link 
               to="/shop" 
               className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group"
             >
               Visit Store <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
             {PRODUCTS.slice(0,4).map((product) => (
                <div key={product.id} className="group cursor-pointer transition-all duration-300 hover:-translate-y-1">
                   <div className="relative bg-white rounded-xl overflow-hidden mb-4 border border-gray-200 group-hover:border-blue-500/30 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all duration-300">
                      <div 
                        className="aspect-square overflow-hidden cursor-pointer"
                        onClick={(e) => handleProductClick(product, e)}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                      </div>
                      {product.tag && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {product.tag}
                        </div>
                      )}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                        aria-label="Add to cart"
                      >
                        <Plus size={20} />
                      </button>
                   </div>
                   <div className="px-2">
                     <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">{product.category}</div>
                     <h3 className="font-bold mb-2 leading-tight text-gray-900 line-clamp-2 h-12">{product.name}</h3>
                     <div className="flex justify-between items-center">  
                       <span className="text-blue-600 font-bold text-lg">${product.price.toFixed(2)}</span>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           addToCart(product);
                         }}
                         className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1 group/button"
                       >
                         <Plus size={14} className="group-hover/button:animate-pulse" />
                         <span>Add To Cart</span>
                       </button>
                     </div>
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsCartOpen(false)}
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
                onClick={() => setIsCartOpen(false)}
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
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-200 border-2 border-dashed border-blue-200">
                    <ShoppingCart size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your cart yet</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 hover:bg-blue-50/50 rounded-lg transition-all border border-transparent hover:border-blue-100">
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
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold w-6 text-center text-gray-900">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)} 
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="text-gray-400 hover:text-red-500 self-start p-1 transition-colors rounded-full hover:bg-red-50"
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
              <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Shipping & taxes calculated at checkout</div>
                  </div>
                </div>
                <button 
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-100"
                  onClick={() => console.log('Checkout')}
                >
                  Proceed to Checkout
                  <ArrowRight size={18} className="mt-0.5" />
                </button>
                <div className="mt-4 text-center">
                  <Link 
                    to="/shop" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    onClick={() => setIsCartOpen(false)}
                  >
                    <ArrowLeft size={14} className="-ml-1" /> Continue Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default FeaturedShopSection;