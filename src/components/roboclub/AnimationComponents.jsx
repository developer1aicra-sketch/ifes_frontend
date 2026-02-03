import React from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

// Floating Element Component
export const FloatingElement = ({ delay = 0, xRange = 20, yRange = 20, duration = 3, children, className }) => (
  <motion.div
    animate={{
      y: [0, -yRange, 0],
      x: [0, xRange, 0, -xRange, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// 3D Tilt Card Component
export const TiltCard = ({ children, className }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    const xPct = x / width - 0.5;
    const yPct = y / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });
  const brightness = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, 0.8]), { stiffness: 150, damping: 20 });

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={`relative transform-gpu transition-all duration-200 ${className}`}
    >
      <motion.div
        style={{ filter: useMotionTemplate`brightness(${brightness})` }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};