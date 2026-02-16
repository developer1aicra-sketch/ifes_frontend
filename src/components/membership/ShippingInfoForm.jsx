import { ArrowRight, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCategories } from "../../app/categories/categoriesSlice";
import { signUpStep2 } from "../../app/auth/authApi";
import { useToast } from "../../contexts/ToastContext";

export const ShippingInfoForm = ({
  formData,
  updateFormData,
  onNext,
  onBack,
  selectedCategory, // This is categoryId
  selectedPlan
}) => {
  const categories = useSelector(selectCategories);
  const toast = useToast();
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get category name from categoryId
  const getCategoryName = () => {
    if (!selectedCategory || !categories?.data) return '';
    const category = categories.data.find(cat => cat._id === selectedCategory);
    return category?.name?.toLowerCase() || '';
  };

  const categoryName = getCategoryName();
  
  const calculatePrice = () => {
    switch (categoryName) {
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

  // Handle logo file upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      updateFormData('logo', file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    updateFormData('logo', '');
  };

  const handleProceedToPayment = async () => {
    // Validate required fields
    if (!formData.address || !formData.city || !formData.state || !formData.country) {
      toast.error('Please fill in all required shipping address fields', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (!formData.dateOfBirth || !formData.gender) {
      toast.error('Please fill in Date of Birth and Gender', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    // Validate category-specific required fields
    if (categoryName === 'institute' && !formData.instituteName) {
      toast.error('Please enter Institute Name', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (categoryName === 'corporate' && !formData.companyName) {
      toast.error('Please enter Company Name', {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    if (categoryName === 'student') {
      const schoolOrCollege = (formData.schoolOrCollege || '').trim();
      const classOrGrade = (formData.classOrGrade || '').trim();

      if (!schoolOrCollege) {
        toast.error('Please enter School/College Name', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        return;
      }

      if (!classOrGrade) {
        toast.error('Please enter Class/Grade', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Build personalAndShippingAddress object
      const personalAndShippingAddress = {
        dob: formData.dateOfBirth || '',
        gender: formData.gender || '',
        tshirtSize: formData.tshirtSize || '',
        fullShippingAddress: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        country: formData.country || ''
      };

      // Build affiliation object based on category
      // For student, this will look like:
      // affiliation: { schoolOrCollege: '...', classOrGrade: '...' }
      const affiliation = {};
      
      if (categoryName === 'institute') {
        affiliation.instituteName = formData.instituteName || '';
        affiliation.RepresentativeName = formData.RepresentativeName || '';
      } else if (categoryName === 'corporate') {
        affiliation.companyName = formData.companyName || '';
        affiliation.industrySector = formData.industrySector || '';
      } else if (categoryName === 'student') {
        affiliation.schoolOrCollege = (formData.schoolOrCollege || '').trim();
        affiliation.classOrGrade = (formData.classOrGrade || '').trim();
      } else if (categoryName === 'professional') {
        affiliation.organizationName = formData.organizationName || '';
        affiliation.jobTitle = formData.jobTitle || '';
      }

      // Prepare FormData for file upload
      // Structure: 
      // logo (binary) - OPTIONAL, only included if provided
      // personalAndShippingAddress[dob], personalAndShippingAddress[gender], ...
      // affiliation[schoolOrCollege], affiliation[classOrGrade], ...
      const formDataToSend = new FormData();
      
      // Add logo only if provided (optional field)
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }
      // If no logo file, don't append anything - API will handle it as optional
      
      // Add personalAndShippingAddress as nested key-value pairs
      Object.entries(personalAndShippingAddress).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(`personalAndShippingAddress[${key}]`, value);
        }
      });
      
      // Add affiliation as nested key-value pairs
      Object.entries(affiliation).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formDataToSend.append(`affiliation[${key}]`, value);
        }
      });

      // Log the payload structure for debugging (matches API structure)
      // Header token is sent as: Authorization: Bearer <token> (see signUpStep2 in authApi.js)
      console.log('FormData Structure:', {
        logo: logoFile ? `(binary file: ${logoFile.name})` : '(not included - optional)',
        personalAndShippingAddress,
        affiliation
      });
      console.log('API Endpoint:', '/signup/step2');
      console.log('Full URL will be:', 'https://worso-backend-psi.vercel.app/api/signup/step2');

      // Call API
      const response = await signUpStep2(formDataToSend);
      
      if (response && response.data) {
        toast.success('Shipping information saved successfully!', {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
        onNext();
      }
    } catch (error) {
      console.error('Error submitting shipping info:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      
      const errorMessage = error.response?.status === 404 
        ? 'API endpoint not found. Please check if /signup/step2 endpoint exists on the server.'
        : error.response?.data?.message || 'Failed to save shipping information. Please try again.';
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col  gap-8">
        {/* Left Column - Shipping Form */}
        <div className=" space-y-6">
          <h3 className="text-xl font-bold text-black flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Shipping & Additional Details
          </h3>
          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              )}
              <div className="flex-1">
                <p className="text-xs text-gray-600">
                  Upload your logo (Max 5MB, JPG/PNG)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.gender || ''}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            {/* Full Shipping Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Full Shipping Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => updateFormData('address', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="House No, Street Name, Area, Landmark"
                rows="3"
                required
              />
            </div>
            
            {/* City */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => updateFormData('city', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mumbai"
                required
              />
            </div>
            
            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                State / Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.state || ''}
                onChange={(e) => updateFormData('state', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Maharashtra"
                required
              />
            </div>
            
            {/* Country */}
            <div className="">
              <label className="block text-sm font-medium text-black mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country || ''}
                onChange={(e) => updateFormData('country', e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Country</option>
                <option value="China">China</option>
              </select>
            </div>

            {/* Affiliation Fields - Conditional based on category */}
            {categoryName === 'institute' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Institute Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.instituteName || ''}
                    onChange={(e) => updateFormData('instituteName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter institute name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    value={formData.RepresentativeName || ''}
                    onChange={(e) => updateFormData('RepresentativeName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter representative name"
                  />
                </div>
              </>
            )}

            {categoryName === 'corporate' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName || ''}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={formData.industrySector || ''}
                    onChange={(e) => updateFormData('industrySector', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Technology, Education, Manufacturing"
                  />
                </div>
              </>
            )}

            {categoryName === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    School / College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.schoolOrCollege || ''}
                    onChange={(e) => updateFormData('schoolOrCollege', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter school/college name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Class / Grade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.classOrGrade || ''}
                    onChange={(e) => updateFormData('classOrGrade', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 10th Grade or 2nd Year Engineering"
                    required
                  />
                </div>
              </>
            )}

            {categoryName === 'professional' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName || ''}
                    onChange={(e) => updateFormData('organizationName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter organization/company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle || ''}
                    onChange={(e) => updateFormData('jobTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Robotics Engineer or Technical Lead"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        
      </div>

      <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-5 justify-between">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          type="button"
          onClick={handleProceedToPayment}
          disabled={isSubmitting}
          className={`px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Proceed to Payment</span>
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};