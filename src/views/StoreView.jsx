import { Plus, Star, ShoppingCart, ArrowRight, XCircle } from "lucide-react";
import { PRODUCTS } from "../../src/utils/data";
import { useState, useCallback, useMemo } from "react";
import { CartDrawer } from "../components/CartDrawer";
import { Link } from "react-router-dom";

/**
 * ProductCard - Displays a single product in the store
 */
const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                {product.tag && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {product.tag}
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label="Add to cart"
                >
                    <Plus size={20} />
                </button>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                        <Star size={14} className="text-blue-400 fill-blue-400" />
                        <span className="text-xs font-bold text-blue-600">{product.rating}</span>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 h-14">
                    {product.name}
                </h3>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 group/button"
                    >
                        <span className="text-sm">Add to Cart</span>
                        <ShoppingCart size={16} className="group-hover/button:animate-bounce" />
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * CategoryFilter - Filter products by category
 */
const CategoryFilter = ({ activeCategory, onSelectCategory }) => {
    const categories = ['All', 'Kits', 'Parts', 'Merch'];

    return (
        <div className="flex flex-wrap gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeCategory === category
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

/**
 * StoreView - Main store component displaying products and cart
 */
export const StoreView = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Memoize filtered products to prevent unnecessary recalculations
    const filteredProducts = useMemo(() => {
        return activeCategory === 'All'
            ? PRODUCTS
            : PRODUCTS.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    // Memoize addToCart function to prevent unnecessary re-renders
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
            setIsCartOpen(true);
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
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-b from-white to-blue-50 border-b border-gray-100">
                <div className="container mx-auto px-6 py-12 md:py-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="max-w-2xl">
                            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">
                                Official Gear
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Worso Store
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Get official kits, parts, and merchandise directly from the World Robotics Society. 
                                Certified for competition use.
                            </p>
                            <div className="mt-6">
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
                                >
                                    <ArrowRight size={16} className="mr-2 transform -rotate-180 group-hover:-translate-x-1 transition-transform" />
                                    Back to Home
                                </Link>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <CategoryFilter
                                    activeCategory={activeCategory}
                                    onSelectCategory={setActiveCategory}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}

            {/* Products Grid */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div 
                                key={product.id}
                                className="cursor-pointer"
                                onClick={(e) => handleProductClick(product, e)}
                            >
                                <ProductCard
                                    product={product}
                                    onAddToCart={addToCart}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-blue-200">
                            <ShoppingCart size={40} className="text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">We couldn't find any products in this category.</p>
                        <button
                            onClick={() => setActiveCategory('All')}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>

            {/* Cart Floating Button */}
            <div className="fixed bottom-5 right-20 z-50">
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-white relative transition-all duration-300 hover:shadow-xl hover:scale-105"
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

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
            />

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
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                                            <Star size={16} className="text-blue-400 fill-blue-400 mr-1" />
                                            <span className="text-sm font-bold text-blue-600">{selectedProduct.rating}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {selectedProduct.category}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 mb-6">
                                        ${selectedProduct.price.toFixed(2)}
                                    </p>
                                    <p className="text-gray-600 mb-6">
                                        {selectedProduct.description || 'No description available for this product.'}
                                    </p>
                                    <div className="flex items-center space-x-4 mb-6 hidden">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button 
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newQuantity = Math.max(1, (selectedProduct.quantity || 1) - 1);
                                                    setSelectedProduct({...selectedProduct, quantity: newQuantity});
                                                }}
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 w-12 text-center">
                                                {selectedProduct.quantity || 1}
                                            </span>
                                            <button 
                                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedProduct({...selectedProduct, quantity: (selectedProduct.quantity || 1) + 1});
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button 
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart({
                                                    ...selectedProduct,
                                                    quantity: selectedProduct.quantity || 1
                                                });
                                                closeProductModal();
                                            }}
                                        >
                                            <ShoppingCart size={18} />
                                            Add to Cart
                                        </button>
                                    </div>
                                    
                                    {/* You May Also Like Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">You May Also Like</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {getRelatedProducts(selectedProduct).map(product => (
                                                <div 
                                                    key={product.id} 
                                                    className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedProduct(product);
                                                    }}
                                                >
                                                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                                                        <img 
                                                            src={product.image} 
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                                                    <p className="text-sm font-bold text-blue-600">${product.price.toFixed(2)}</p>
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
        </div>
    );
};