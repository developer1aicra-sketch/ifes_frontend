import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CMS_DATA_PRODUCT } from '../../constants/data';
import { NavLink } from 'react-router-dom';

const PRODUCTS = [
  { id: 1, name: "TX-Pro Motor Kit", price: "$129", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Lidar Sensor V2", price: "$299", image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Robo Chassis X1", price: "$89", image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400" },
];

const ShopSection = () => (
  <section id="shop" className="py-24 bg-slate-950 border-t border-slate-900">
    <div className=" mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold text-white">Roboclub Store</h2>
          <p className="text-slate-400 mt-2">Official parts, kits, and merchandise.</p>
        </div>
        <NavLink  to="/shop" className="text-cyan-400 font-bold flex items-center gap-2 hover:text-cyan-300">
          View All <ArrowRight size={16} />
        </NavLink >
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {CMS_DATA_PRODUCT?.products?.slice(0,3)?.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -10 }}
            className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <button className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
                <ShoppingBag size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold text-lg">{product.name}</h3>
                <span className="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">${product.price}</span>
              </div>
              <p className="text-slate-500 text-sm">High-performance robotics component for WRC standards.</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ShopSection;