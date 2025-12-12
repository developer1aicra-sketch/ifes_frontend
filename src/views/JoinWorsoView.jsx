import React, { useState } from 'react';
import { ArrowLeft, Upload, Globe, Building, User, Mail, Phone, Calendar, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JoinWorsoView = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Organization Details
    organizationName: '',
    organizationHead: '',
    email: '',
    countryCode: '91',
    mobile: '',
    website: '',
    country: '',
    state: '',
    city: '',
    establishmentYear: '',
    majorActivities: '',
    numberOfMembers: '',
    governmentAffiliation: '',
    
    // Applicant Details
    applicantName: '',
    applicantDesignation: '',
    applicantEmail: '',
    applicantCountryCode: '91',
    applicantMobile: '',
    
    // Supporting Documents
    organizationBrief: null,
    financialStatement: null,
    remarks: ''
  });

  const countries = [
    'United States', 'India', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'Japan', 'China', 'South Korea', 'Brazil', 'Mexico'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // You would typically send this to your backend
    alert('Application submitted successfully! We will get back to you soon.');
    navigate('/associates');
  };

  return (
    <div className="animate-fadeIn pt-24 pb-20 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate('/associates')}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Associates & Partners</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Join WORSO Registration
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Complete the form below to apply for WORSO membership. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Organization Details Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="text-blue-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Organization Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Association / Federation Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter organization name"
                />
              </div>

              {/* Organization Head */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Organization Head *
                </label>
                <input
                  type="text"
                  name="organizationHead"
                  value={formData.organizationHead}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter head's name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="organization@example.com"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Mobile No. *
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-4 py-3 border border-slate-300 rounded-lg">
                    <span className="text-slate-400">+</span>
                    <input
                      type="text"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="w-16 outline-none"
                      placeholder="91"
                    />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              {/* Website */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Website (if any)
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://example.com"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Select Country --</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* State and City */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  State/Province *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Select State --</option>
                  <option value="State 1">State 1</option>
                  <option value="State 2">State 2</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Select City --</option>
                  <option value="City 1">City 1</option>
                  <option value="City 2">City 2</option>
                </select>
              </div>

              {/* Year of Establishment */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Year of Establishment *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    name="establishmentYear"
                    value={formData.establishmentYear}
                    onChange={handleChange}
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full pl-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 2015"
                  />
                </div>
              </div>

              {/* Number of Members */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  No. of Members *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="number"
                    name="numberOfMembers"
                    value={formData.numberOfMembers}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full pl-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter number of members"
                  />
                </div>
              </div>

              {/* Major Activities */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Major Activities in Past *
                </label>
                <textarea
                  name="majorActivities"
                  value={formData.majorActivities}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Describe major activities, tournaments, events organized"
                />
              </div>

              {/* Government Affiliation */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Any affiliation with Government? If yes, describe
                </label>
                <textarea
                  name="governmentAffiliation"
                  value={formData.governmentAffiliation}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Describe government affiliation if any"
                />
              </div>
            </div>
          </div>

          {/* Applicant Details Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <User className="text-green-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Applicant Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Applicant Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Applicant Name *
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter applicant name"
                />
              </div>

              {/* Applicant Designation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Applicant Designation *
                </label>
                <input
                  type="text"
                  name="applicantDesignation"
                  value={formData.applicantDesignation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter designation"
                />
              </div>

              {/* Applicant Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Email ID *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    name="applicantEmail"
                    value={formData.applicantEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="applicant@example.com"
                  />
                </div>
              </div>

              {/* Applicant Mobile */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Mobile No. *
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-4 py-3 border border-slate-300 rounded-lg">
                    <span className="text-slate-400">+</span>
                    <input
                      type="text"
                      name="applicantCountryCode"
                      value={formData.applicantCountryCode}
                      onChange={handleChange}
                      className="w-16 outline-none"
                      placeholder="91"
                    />
                  </div>
                  <input
                    type="tel"
                    name="applicantMobile"
                    value={formData.applicantMobile}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Supporting Documents</h2>
            </div>

            <div className="space-y-6">
              {/* Organization Brief */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Brief of Organization *
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors group">
                      <Upload className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2" size={24} />
                      <p className="text-slate-600">
                        {formData.organizationBrief 
                          ? formData.organizationBrief.name 
                          : 'Click to upload PDF/DOC file (max 5MB)'}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">PDF, DOC, DOCX files only</p>
                    </div>
                    <input
                      type="file"
                      name="organizationBrief"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      required
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Financial Statement */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Financial Statement of Past Year *
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors group">
                      <Upload className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2" size={24} />
                      <p className="text-slate-600">
                        {formData.financialStatement 
                          ? formData.financialStatement.name 
                          : 'Click to upload financial statement (max 10MB)'}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">PDF, XLS, XLSX files only</p>
                    </div>
                    <input
                      type="file"
                      name="financialStatement"
                      onChange={handleFileChange}
                      accept=".pdf,.xls,.xlsx"
                      required
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Remarks, If any
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Additional comments or remarks"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-12 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Submit Application
            </button>
            <p className="text-slate-500 text-sm mt-4">
              By submitting, you agree to our terms and conditions. We'll contact you within 5-7 business days.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinWorsoView;