export const OrderSummary = ({ selectedCategory, selectedPlan, formData }) => {
  const calculatePrice = () => {
    switch (selectedCategory) {
      case 'student':
        return selectedPlan === 'basic' ? { subtotal: 10, total: 10 } : { subtotal: 50, total: 50 };
      case 'professional':
        return { subtotal: 100, total: 100 };
      case 'institute':
        return { subtotal: 200, total: 200 };
      case 'corporate':
        return { subtotal: 500, total: 500 };
      default:
        return { subtotal: 0, total: 0 };
    }
  };

  const prices = calculatePrice();

  const getPlanName = () => {
    const categoryNames = {
      student: 'Student',
      professional: 'Professional',
      institute: 'Institute',
      corporate: 'Corporate'
    };
    
    const planNames = {
      basic: 'Basic',
      premium: 'Premium',
      professional: 'Professional',
      institute: 'Institute',
      corporate: 'Corporate'
    };
    
    return `${categoryNames[selectedCategory]} ${planNames[selectedPlan]}`;
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

      <div className="space-y-4">
        {/* Membership Details */}
        <div className=" rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-white">{getPlanName()}</h3>
              <p className="text-sm text-gray-400">Annual Membership</p>
            </div>
            <span className="font-bold text-red-400">${prices.total} USD</span>
          </div>
          <div className="text-xs text-gray-500">
            Billed annually • Auto-renewable
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Name:</span>
            <span className="font-medium text-white">{formData.fullName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Email:</span>
            <span className="font-medium text-white">{formData.email}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Phone:</span>
            <span className="font-medium text-white">{formData.phone}</span>
          </div>
        </div>

        <hr className="my-4 border-gray-700" />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>${prices.subtotal} USD</span>
          </div>
          
          <div className="flex justify-between text-gray-300">
            <span>Processing Fee</span>
            <span className="text-green-400">$0.00</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
            <span className="text-white">Total Amount</span>
            <span className="text-red-400">${prices.total} USD</span>
          </div>
        </div>
      </div>
    </div>
  );
};