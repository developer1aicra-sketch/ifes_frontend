import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CMS_DATA_PRODUCT } from '../../constants/cmsData';
import { NavLink } from 'react-router-dom';

const PRODUCTS = [
  { id: 1, name: "TX-Pro Motor Kit", price: "$129", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Lidar Sensor V2", price: "$299", image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Robo Chassis X1", price: "$89", image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&q=80&w=400" },
];

const ShopSection = () => (
  <section id="shop" className=" bg-slate-950 border-t border-slate-900">
  
  </section>
);

export default ShopSection;