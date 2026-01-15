import { ArrowRight } from "lucide-react";

export const PersonalInfoForm = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack 
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Personal & Contact Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium  mb-1 text-black">
            Full Name <span className="text-blue-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            className="w-full px-4 py-3 bg-white-700 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="e.g. Rahul Sharma"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-black-300 mb-1">
            Designation <span className="text-blue-500">*</span>
          </label>
          <select
            value={formData.designation}
            onChange={(e) => updateFormData('designation', e.target.value)}
            className="w-full px-4 py-3 text-black border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          >
            <option value="" className="text-black">Select any one</option>
            <option value="Student" className="text-black">Student</option>
            <option value="Professional" className="text-black">Professional</option>
            <option value="Educator" className="text-black">Educator</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black-300 mb-1">
            Email Address <span className="text-blue-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full px-4 py-3 bg-white-700 border border-gray-600 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="rahul@example.com"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-black-300 mb-1">
            Mobile No <span className="text-blue-500">*</span>
          </label>
          <div className="flex">
            <div className="flex items-center px-3  border border-r-0 border-gray-600 rounded-l-lg">
              <span className="text-black">🇮🇳 +91</span>
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              className="flex-1 px-4 py-3  border border-l-0 border-gray-600 rounded-r-lg  placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="9876543210"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-700 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-600 text-black font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          Continue to Shipping
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};