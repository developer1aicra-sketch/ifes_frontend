import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Mail, Globe, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { COUNTRIES, getStatesByCountry, getCitiesByState } from '../constants/locationData';
import { COUNTRY_DIAL_CODES } from '../constants/countryDialCodes';
import marketingPromotionImg from '../assets/becomepartner/marketing-promotion.webp';
import pointOfSaleImg from '../assets/becomepartner/Point-of-Sale.webp';
import stemlabLogoImg from '../assets/becomepartner/stemlab-logo.webp';
import txLogoImg from '../assets/becomepartner/txlogo.webp';

/** RFC 5322 simplified email validation */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const PARTNERSHIP_TYPES = [
  { id: 'district', label: 'District Franchise (India)' },
  { id: 'national', label: 'National Partner (International)' },
];

const WHO_CAN_PARTNER = [
  'EdTech entrepreneurs',
  'Entrepreneurs having interest in Tech Business',
  'School/college owners',
  'STEM training institutes',
  'Robotics & drone academies',
  'International education organizations',
  'Innovation & startup hubs',
];

const SUPPORT_FEATURES = [
  {
    id: 'marketing',
    title: 'Marketing Promotion',
    description:
      'We extensively engage target group on social media, with organic and promoted ads. Also drive traffic to local distribution points & skyrocket Abira DIY Kit sales!',
    image: marketingPromotionImg,
    alt: 'Marketing Promotion',
  },
  {
    id: 'pos',
    title: 'Point-of-Sale (POS)',
    description:
      'Eye-catching POS materials are provided to associates for driving customer engagement & boost sales of Abira DIY Kits. Also participating in various exhibitions and promoting Eye-catching area boost over all business of Abira DIYs!',
    image: pointOfSaleImg,
    alt: 'Point-of-Sale',
  },
  {
    id: 'stemlab',
    title: 'Endorsement to India STEM Labs',
    description:
      'Abira DIY kits are well accepted in India STEM Lab model which is established in various education institutions across India.',
    image: stemlabLogoImg,
    alt: 'India STEM Labs',
  },
  {
    id: 'technoxian',
    title: 'TechnoXian World Robotics Championship',
    description:
      "We organize the biggest robotics championship - TechnoXian in various countries supported by International Federation of sports. Abira DIY kits are approved for the participation of youth in various challenges. This helps in acceptance of Abira DIY among target group.",
    image: txLogoImg,
    alt: 'TechnoXian World Robotics Championship',
  },
];

const PARTNER_SUPPORT_SECTIONS = [
  {
    id: 'training',
    title: 'Comprehensive Training Program',
    items: [
      'Develop sessions on product knowledge, sales techniques, and operational procedures.',
      'Regular updates and advanced training on new products and technologies.',
    ],
  },
  {
    id: 'marketing-branding',
    title: 'Marketing and Branding Support',
    items: [
      'Access to official branding materials, logos, and marketing collateral.',
      'Assistance with local marketing strategies and promotional events.',
    ],
  },
  {
    id: 'technical',
    title: 'Technical Support',
    items: [
      'Access to technical help for troubleshooting and repairs.',
      'Receive comprehensive training and ongoing technical support to ensure your team is equipped to sell and support Abira products effectively.',
    ],
  },
  {
    id: 'sales-customer',
    title: 'Sales and Customer Service Support',
    items: [
      'Training for customer interaction and service excellence.',
      'Proven sales techniques and strategies to boost performance.',
    ],
  },
];

const BUSINESS_MODEL_ITEMS = [
  {
    id: 'membership',
    title: 'MEMBERSHIP',
    description:
      'Drive student engagement, offer exclusive training, and host competitions with TechnoXian Membership at your franchise.',
  },
  {
    id: 'kit-selling',
    title: 'KIT SELLING',
    description:
      'Sell Abira DIY kits to large target groups including students, schools, and hobbyists, boosting hands-on tech learning.',
  },
  {
    id: 'competitions',
    title: 'COMPETITIONS',
    description:
      'Host district-level competitions to spark innovation and discover young talent and select teams for National / International Championships.',
  },
  {
    id: 'bootcamps',
    title: 'BOOTCAMPS',
    description:
      'Opportunity to organize TechnoXian boot-camps, generating revenue through hands-on training and skill development programs in outstation.',
  },
  {
    id: 'nxr-lab',
    title: 'NxR LAB SETUP',
    description:
      'Establish Next Generation Robotics Lab in Education Institutions (School/Colleges). Long term recurring revenue from each Lab Setup.',
  },
  {
    id: 'offline-workshops',
    title: 'OFF-LINE WORKSHOPS',
    description:
      'Opportunity to organize Offline workshops in schools and colleges for advance technologies including Robotics, AI, ML, Blockchain, AR/VR, UAV etc. Trainers will be arranged by Abira.',
  },
];

const BecomePartnerView = () => {
  const [formData, setFormData] = useState({
    name: '',
    organisationName: '',
    email: '',
    phoneCountryCode: '91',
    mobile: '',
    regionCountry: 'IN',
    state: '',
    stateText: '',
    city: '',
    cityText: '',
    partnershipType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const formSectionRef = useRef(null);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'mobile') {
        next.mobile = value.replace(/\D/g, '');
      } else if (name === 'regionCountry') {
        next.state = '';
        next.stateText = '';
        next.city = '';
        next.cityText = '';
      } else if (name === 'state') {
        next.city = '';
        next.cityText = '';
      }
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const statesForCountry = getStatesByCountry(formData.regionCountry);
  const citiesForState = getCitiesByState(formData.state);
  const hasPredefinedStates = statesForCountry.length > 0;

  const validateForm = () => {
    const next = {};
    if (!formData.name?.trim()) next.name = 'Name is required';
    if (!formData.organisationName?.trim()) next.organisationName = 'Organisation name is required';
    if (!formData.email?.trim()) {
      next.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      next.email = 'Please enter a valid email address';
    }
    if (!formData.mobile?.trim()) next.mobile = 'Mobile number is required';
    if (!formData.regionCountry) next.regionCountry = 'Region/Country is required';
    if (!formData.partnershipType) next.partnershipType = 'Partnership type is required';
    if (hasPredefinedStates) {
      if (!formData.state) next.state = 'State is required';
    } else if (!formData.stateText?.trim()) {
      next.stateText = 'State/Region is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const stateVal = hasPredefinedStates
      ? statesForCountry.find((s) => s.id === formData.state)?.name || formData.state
      : formData.stateText;
    const cityVal = hasPredefinedStates
      ? citiesForState.find((c) => c.id === formData.city)?.name || formData.city
      : formData.cityText;
    const payload = {
      ...formData,
      state: stateVal,
      city: cityVal,
      phone: `+${formData.phoneCountryCode}${formData.mobile}`,
    };
    delete payload.stateText;
    delete payload.cityText;
    console.log('Partner form submitted:', payload);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            TechnoXian Partner With Us
          </h1>
       
          <button
            type="button"
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
            Submit Expression of Interest
          </button>
        </motion.div>

        {/* Who Can Partner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Who Can Partner?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WHO_CAN_PARTNER.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Partnership Models */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Partnership Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <span className="text-2xl mb-3 block">🇮🇳</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">District Franchise (India)</h3>
              <p className="text-slate-600 text-sm">
                Take the lead in promoting TechnoXian programs and regional qualifiers in your district as well as selling memberships.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
              <span className="text-2xl mb-3 block">🌍</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">National Partner (International)</h3>
              <p className="text-slate-600 text-sm">
                Represent TechnoXian in your country, organize national-level events, and send teams to the TechnoXian World Cup.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Support Features - Marketing, POS, STEM Labs, TechnoXian */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Empowering Success Through Comprehensive Support
          </h2>
          <h3 className="text-lg font-semibold text-emerald-600 mb-6">MARKETING SUPPORT SYSTEM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SUPPORT_FEATURES.map((feature, i) => (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 flex-shrink-0 p-6 flex items-center justify-center bg-slate-50/50">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="w-48 h-48 md:w-56 md:h-56 object-contain"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Partner Support Sections: Training, Marketing, Technical, Sales */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_SUPPORT_SECTIONS.map((section, i) => (
              <motion.article
                key={section.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.35 + i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white shadow-sm p-6"
              >
                <h4 className="text-base font-semibold text-slate-900 mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-slate-600 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Business Model Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            ENGAGE, PLAY, LEARN: ROBOTICS REVOLUTIONIZED
          </h2>
          <h3 className="text-lg font-semibold text-emerald-600 mb-4">BUSINESS MODEL</h3>
          <p className="text-slate-600 mb-8 max-w-3xl leading-relaxed">
            TechnoXian Orbit&apos;s business model integrates retail, interactive play, and educational training.
            This franchise model offers a wide range of robotics and drone kits, a play station for hands-on
            testing, and a training zone for skill development. Revenue is generated through product sales,
            play fees, and workshop registrations, ensuring diverse income streams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUSINESS_MODEL_ITEMS.map((item, i) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 + i * 0.05 }}
                className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-col"
              >
                <span className="text-xs font-bold tracking-wider text-emerald-600 mb-2">
                  {item.title}
                </span>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Form Section */}
        <motion.section
          ref={formSectionRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 md:p-8 scroll-mt-24"
        >
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-600">
                We have received your partnership inquiry. Our team will get in touch with you shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Enter your details</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Organisation Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="organisationName"
                        value={formData.organisationName}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your organisation name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Email Id <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-11 pr-4 py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Mobile No. <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          name="phoneCountryCode"
                          value={formData.phoneCountryCode}
                          onChange={handleChange}
                          className="w-24 min-w-0 pl-3 pr-8 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                        >
                          {COUNTRY_DIAL_CODES.map((c) => (
                            <option key={c.code} value={c.dial} className="bg-white text-slate-900">
                              +{c.dial}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`flex-1 px-4 py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.mobile ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter mobile number"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Region/Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <select
                        name="regionCountry"
                        value={formData.regionCountry}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-10 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.id} value={c.id} className="bg-white text-slate-900">
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Partnership Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <select
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleChange}
                        required
                        className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">-- Select Partnership Type --</option>
                        {PARTNERSHIP_TYPES.map((t) => (
                          <option key={t.id} value={t.id} className="bg-white text-slate-900">
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* State / City - cascading for countries with data, text input for others */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hasPredefinedStates ? (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          State <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                            className={`w-full pl-11 pr-10 py-3 bg-white border rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:bg-slate-50 ${
                              errors.state ? 'border-red-500' : 'border-slate-300'
                            }`}
                            disabled={!formData.regionCountry}
                          >
                            <option value="">Please Select State</option>
                            {statesForCountry.map((s) => (
                              <option key={s.id} value={s.id} className="bg-white text-slate-900">
                                {s.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">City</label>
                        <div className="relative">
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:bg-slate-50"
                            disabled={!formData.state}
                          >
                            <option value="" className="bg-white text-slate-900">
                              {formData.state ? 'Select City' : '-- Select State First --'}
                            </option>
                            {citiesForState.map((c) => (
                              <option key={c.id} value={c.id} className="bg-white text-slate-900">
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          State / Region <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="stateText"
                          value={formData.stateText}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.stateText ? 'border-red-500' : 'border-slate-300'
                          }`}
                          placeholder="Enter state or region"
                        />
                        {errors.stateText && (
                          <p className="text-red-500 text-xs mt-1">{errors.stateText}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">City</label>
                        <input
                          type="text"
                          name="cityText"
                          value={formData.cityText}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter city"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default BecomePartnerView;
