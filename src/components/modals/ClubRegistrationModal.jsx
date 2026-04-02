import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as CSC from 'country-state-city/lib/cjs/index.js';
import {
  X,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Building2,
  MapPin,
  Phone,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { addClub } from '../../api/clubApi';
import { getRoboclubAuthToken } from '../../api/authToken';
import { useLocationPrefix } from '../../hooks/useLocationPrefix';
import { pathWithLocationPrefix } from '../../utils/locationRoutes';

const ClubRegistrationModal = ({ showModal, setShowModal, onSuccess }) => {
  const navigate = useNavigate();
  const { locationPrefix } = useLocationPrefix();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: '',
    clubName: '',
    instituteName: '',
    countryCode: 'IN',
    country: 'India',
    stateCode: '',
    state: '',
    city: '',
    mobile: '',
    email: '',
    password: '',
  });

  const countries = useMemo(() => {
    const all = CSC.Country.getAllCountries();
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const states = useMemo(() => {
    if (!form.countryCode) return [];
    const all = CSC.State.getStatesOfCountry(form.countryCode);
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }, [form.countryCode]);

  const cities = useMemo(() => {
    if (!form.countryCode || !form.stateCode) return [];
    const all = CSC.City.getCitiesOfState(form.countryCode, form.stateCode);
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }, [form.countryCode, form.stateCode]);

  const hasStateList = states.length > 0;
  const hasCityList = cities.length > 0;

  const updateForm = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'countryCode') {
        const country = CSC.Country.getCountryByCode(value);
        next.country = country?.name || '';
        next.stateCode = '';
        next.state = '';
        next.city = '';
      }
      if (field === 'stateCode') {
        const state = CSC.State.getStateByCodeAndCountry(value, next.countryCode);
        next.state = state?.name || '';
        next.city = '';
      }
      return next;
    });
  };

  // Step 1 complete hone tak Next disable — step 2 par nahi ja sakte
  const isStep1Complete = () => {
    const { name, clubName, instituteName, email, password } = form;
    if (!name.trim()) return false;
    if (!clubName.trim()) return false;
    if (!instituteName.trim()) return false;
    if (!email.trim()) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return false;
    if (!password || password.length < 6) return false;
    return true;
  };

  const validateStep1 = () => {
    const { name, clubName, instituteName, email, password } = form;
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!clubName.trim()) {
      setError('Please enter the club name');
      return false;
    }
    if (!instituteName.trim()) {
      setError('Please enter the institute name');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Please enter a password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmitClub = async () => {
    const { name, clubName, instituteName, countryCode, country, state, city, mobile, email, password } = form;
    if (!state.trim()) {
      setError('Please enter state');
      return;
    }
    if (!city.trim()) {
      setError('Please enter city');
      return;
    }
    if (!mobile.trim()) {
      setError('Please enter mobile number');
      return;
    }
    const mobileClean = mobile.replace(/\D/g, '');
    if (countryCode === 'IN') {
      if (mobileClean.length !== 10) {
        setError('Please enter exactly 10 digits for mobile number');
        return;
      }
    } else {
      if (mobileClean.length < 7 || mobileClean.length > 15) {
        setError('Please enter a valid mobile number (7 to 15 digits)');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      await addClub({
        name: name.trim(),
        clubName: clubName.trim(),
        instituteName: instituteName.trim(),
        countryCode: countryCode || 'IN',
        country: country || 'India',
        state: state.trim(),
        city: city.trim(),
        mobile: mobileClean,
        email: email.trim(),
        password,
      });
      setStep(3);
      // TODO: hook into global toast system if needed
      // e.g. showToast('Club registered successfully', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to register club';
      setError(msg);
      // TODO: hook into global toast system if needed
      // e.g. showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setError('');
    setShowPassword(false);
    setForm({
      name: '',
      clubName: '',
      instituteName: '',
      countryCode: 'IN',
      country: 'India',
      stateCode: '',
      state: '',
      city: '',
      mobile: '',
      email: '',
      password: '',
    });
  };

  const handleContinue = () => {
    handleClose();
    if (onSuccess) onSuccess();
    const roboclubToken = getRoboclubAuthToken();
    navigate(pathWithLocationPrefix(locationPrefix, roboclubToken ? '/roboclub-dashboard' : '/roboclub-login'));
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-2xl animate-fade-in-up my-auto relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 pointer-events-none" />

        <div className="relative z-10 p-8">
          {/* Step 1: Your details & club */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center border-b border-slate-700 pb-4">
                <p className="text-cyan-400 text-sm font-medium mb-1">Step 1 of 2</p>
                <h3 className="text-xl font-bold text-white">Your details & club</h3>
                <p className="text-slate-400 text-sm">Enter your name, club and account details.</p>
              </div>

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <Shield size={14} />
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Club name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      value={form.clubName}
                      onChange={(e) => updateForm('clubName', e.target.value)}
                      placeholder="e.g. Tech Innovators"
                      className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Institute name</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      value={form.instituteName}
                      onChange={(e) => updateForm('instituteName', e.target.value)}
                      placeholder="e.g. ABC College"
                      className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => updateForm('password', e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-11 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:text-slate-300 outline-none transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={!isStep1Complete()}
                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-4 rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Next
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Location & contact */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center border-b border-slate-700 pb-4">
                <p className="text-cyan-400 text-sm font-medium mb-1">Step 2 of 2</p>
                <h3 className="text-xl font-bold text-white">Location & contact</h3>
                <p className="text-slate-400 text-sm">Where is your club based?</p>
              </div>

              {error && (
                <p className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <Shield size={14} />
                  {error}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Country</label>
                  <select
                    value={form.countryCode}
                    onChange={(e) => updateForm('countryCode', e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 text-white px-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                  >
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">State</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    {hasStateList ? (
                      <select
                        value={form.stateCode}
                        onChange={(e) => updateForm('stateCode', e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                      >
                        <option value="" disabled>
                          Select state
                        </option>
                        {states.map((s) => (
                          <option key={`${s.countryCode}-${s.isoCode}`} value={s.isoCode}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => updateForm('state', e.target.value)}
                        placeholder="Enter state / region"
                        className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    {hasCityList ? (
                      <select
                        value={form.city}
                        onChange={(e) => updateForm('city', e.target.value)}
                        disabled={!form.stateCode}
                        className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="" disabled>
                          {form.stateCode ? 'Select city' : 'Select state first'}
                        </option>
                        {cities.map((c) => (
                          <option key={`${c.stateCode}-${c.name}`} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => updateForm('city', e.target.value)}
                        placeholder="Enter city"
                        className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-1">Mobile</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => updateForm('mobile', e.target.value.replace(/\D/g, '').slice(0, 15))}
                      placeholder={form.countryCode === 'IN' ? 'e.g. 9876543210' : 'Enter mobile number'}
                      maxLength={15}
                      className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-lg outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-slate-700 text-slate-300 font-bold py-4 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <button
                  onClick={handleSubmitClub}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-4 rounded-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Register for RoboClub
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(74,222,128,0.5)]">
                <CheckCircle size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Welcome to RoboClub!</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Your club has been registered successfully. You can now continue to the dashboard.
                </p>
                <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                  <p className="text-cyan-400 font-mono text-sm mb-1">Registration complete</p>
                  <p className="text-white font-bold">{form.clubName || 'Your club'}</p>
                </div>
              </div>
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-4 rounded-lg hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] transition-all flex items-center justify-center gap-2"
              >
                Continue to Login
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="absolute top-4 right-4 z-20 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Close registration"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ClubRegistrationModal;
