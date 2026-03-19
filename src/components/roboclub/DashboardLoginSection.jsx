import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock, ArrowRight, CheckCircle, Mail, Github, User } from 'lucide-react';

const DashboardLoginSection = () => {
  const [loginStep, setLoginStep] = useState('email');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginStep('otp');
    }, 1500);
  };

  const handleVerifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginStep('success');
    }, 1500);
  };

  return (
    <section className="">
     
    </section>
  );
};

export default DashboardLoginSection;