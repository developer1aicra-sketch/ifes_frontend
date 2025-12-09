import { X, UploadCloud } from 'lucide-react';

// This component expects a 'jobTitle' (string) and 'onClose' (function) prop
const ApplicationForm = ({ jobTitle, onClose }) => {
  // Simple handler to simulate form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Application for ${jobTitle} submitted! (This is a placeholder action)`);
    onClose(); // Close the form after submission
  };

  return (
    // Overlay backdrop
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-slideUpAndFade relative max-h-[90vh] overflow-y-auto">
        
        {/* Header and Close Button */}
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">Apply for: {jobTitle}</h2>
          <p className="text-slate-500 mt-1">Please fill out the details below to submit your application.</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close application form"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="(123) 456-7890"
            />
          </div>
          
          {/* Cover Letter/Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
              Cover Letter / Message (Optional)
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us why you're a great fit for this role..."
            ></textarea>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload Resume/CV <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud size={32} className="text-slate-400" />
                  <p className="mb-2 text-sm text-slate-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-400">PDF, DOCX, or DOC (MAX. 5MB)</p>
                </div>
                <input id="file-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" required />
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/50 mt-4"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;