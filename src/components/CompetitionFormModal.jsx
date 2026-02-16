import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { COMPETITION_CATEGORIES } from '../constants/competition';

const CompetitionFormModal = ({ competition, events = [], seasons = [], selectedEvent, selectedSeason, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    prizePool: 0,
    teamRequirements: { minMembers: 1, maxMembers: 4 },
    duration: { value: 1, unit: 'day' },
    downloadTitles: [],
    rulesAndRegulations: '',
    trainingResourseUrl: '',
    pastWinnerUrl: '',
    globalRankingeUrl: '',
    bannerImage: '',
    hasBots: false,
    isActive: true,
    event_id: '',
    season_id: '',
  });

  const [errors, setErrors] = useState({});
  const [downloadTitle, setDownloadTitle] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState('');

  useEffect(() => {
    if (competition) {
      let downloadTitles = [];
      if (competition.downloadTitles && Array.isArray(competition.downloadTitles)) {
        downloadTitles = competition.downloadTitles;
      } else if (competition.downloads && Array.isArray(competition.downloads)) {
        downloadTitles = competition.downloads.map((d) => (typeof d === 'string' ? d : d.title || ''));
      }
      setForm({
        name: competition.name || '',
        category: competition.category || '',
        description: competition.description || '',
        prizePool: competition.prizePool || 0,
        teamRequirements: competition.teamRequirements || { minMembers: 1, maxMembers: 4 },
        duration: competition.duration || { value: 1, unit: 'day' },
        downloadTitles,
        rulesAndRegulations: competition.rulesAndRegulations || '',
        trainingResourseUrl: competition.trainingResourseUrl || '',
        pastWinnerUrl: competition.pastWinnerUrl || '',
        globalRankingeUrl: competition.globalRankingeUrl || '',
        bannerImage: competition.bannerImage || '',
        hasBots: competition.hasBots !== undefined ? competition.hasBots : false,
        isActive: competition.isActive !== undefined ? competition.isActive : true,
        event_id: competition.event_id || competition.eventId || '',
        season_id: competition.season_id || competition.seasonId || '',
      });
      setBannerImagePreview(competition.bannerImage || '');
    } else {
      setForm((prev) => ({
        ...prev,
        event_id: selectedEvent?._id || selectedEvent?.id || '',
        season_id: selectedSeason?._id || selectedSeason?.id || '',
      }));
      setBannerImagePreview('');
      setBannerImageFile(null);
    }
  }, [competition, selectedEvent, selectedSeason]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'teamRequirements.minMembers' || name === 'teamRequirements.maxMembers') {
      const field = name.split('.')[1];
      const num = parseInt(value, 10) || (field === 'minMembers' ? 1 : 4);
      setForm((prev) => {
        const next = { ...prev.teamRequirements, [field]: num };
        if (field === 'minMembers' && next.minMembers > (next.maxMembers ?? 4)) next.maxMembers = next.minMembers;
        if (field === 'maxMembers' && next.maxMembers < (next.minMembers ?? 1)) next.minMembers = next.maxMembers;
        return { ...prev, teamRequirements: next };
      });
    } else if (name === 'duration.value' || name === 'duration.unit') {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        duration: {
          ...prev.duration,
          [field]: field === 'value' ? Math.max(1, parseInt(value, 10) || 1) : value,
        },
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'number' ? parseInt(value, 10) || 0 : value },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAddDownload = () => {
    if (downloadTitle.trim()) {
      setForm((prev) => ({ ...prev, downloadTitles: [...prev.downloadTitles, downloadTitle.trim()] }));
      setDownloadTitle('');
    }
  };

  const handleRemoveDownload = (index) => {
    setForm((prev) => ({ ...prev, downloadTitles: prev.downloadTitles.filter((_, i) => i !== index) }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, bannerImage: 'Please upload a valid image (JPEG, PNG, GIF, or WebP)' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, bannerImage: 'Image must be smaller than 10MB' }));
        return;
      }
      setBannerImageFile(file);
      setErrors((prev) => ({ ...prev, bannerImage: '' }));
      const reader = new FileReader();
      reader.onload = () => setBannerImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBannerImage = () => {
    setBannerImageFile(null);
    setBannerImagePreview('');
    setForm((prev) => ({ ...prev, bannerImage: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Competition name is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.season_id) newErrors.season_id = 'Season is required';
    if (!form.event_id) newErrors.event_id = 'Event is required';
    if (!bannerImageFile && (!form.bannerImage || !String(form.bannerImage).trim()) && !competition) {
      newErrors.bannerImage = 'Banner image is required for new competition';
    }
    const minM = form.teamRequirements?.minMembers ?? 1;
    const maxM = form.teamRequirements?.maxMembers ?? 4;
    if (minM < 1) newErrors.minMembers = 'Minimum members must be at least 1';
    if (maxM < minM) newErrors.maxMembers = 'Maximum members must be ≥ minimum members';
    if ((form.duration?.value ?? 1) < 1) newErrors.duration = 'Duration must be at least 1';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    let minMembers = Math.max(1, parseInt(form.teamRequirements?.minMembers, 10) || 1);
    let maxMembers = Math.max(1, parseInt(form.teamRequirements?.maxMembers, 10) || 4);
    if (minMembers > maxMembers) maxMembers = minMembers;
    const durationValue = Math.max(1, parseInt(form.duration?.value, 10) || 1);
    const durationUnit = form.duration?.unit || 'day';
    const titles = form.downloadTitles || [];

    // Frontend contract: send flat bracket keys for backend (duration[value], teamRequirements[minMembers], downloadTitles[0], ...)
    const competitionData = {
      name: form.name.trim(),
      category: form.category || '',
      description: (form.description || '').trim(),
      prizePool: parseFloat(form.prizePool) || 0,
      'duration[value]': durationValue,
      'duration[unit]': durationUnit,
      'teamRequirements[minMembers]': minMembers,
      'teamRequirements[maxMembers]': maxMembers,
      rulesAndRegulations: (form.rulesAndRegulations || '').trim(),
      trainingResourseUrl: (form.trainingResourseUrl || '').trim() || '',
      pastWinnerUrl: (form.pastWinnerUrl || '').trim() || '',
      globalRankingeUrl: (form.globalRankingeUrl || '').trim() || '',
      bannerImage: bannerImageFile || form.bannerImage || '',
      hasBots: !!form.hasBots,
      isActive: !!form.isActive,
      event_id: form.event_id || '',
      season_id: form.season_id || '',
    };
    titles.forEach((title, index) => {
      competitionData[`downloadTitles[${index}]`] = title;
    });
    onSave(competitionData);
  };

  const availableEvents = selectedSeason
    ? events.filter((e) => {
        const sid = selectedSeason._id || selectedSeason.id;
        return (e.season_id || e.seasonId) === sid;
      })
    : events;

  const inputClass = 'w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {competition ? 'Edit Competition' : 'Create New Competition'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {competition ? 'Update competition details' : 'Fill in the details to create a new competition'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Competition Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Water Rocket Challenge"
                className={inputClass}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass} required>
                <option value="">Select Category</option>
                {COMPETITION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter competition description"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Season *</label>
              <select
                name="season_id"
                value={form.season_id}
                onChange={handleChange}
                className={inputClass}
                disabled={!!selectedSeason}
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s._id || s.id} value={s._id || s.id}>{s.name} ({s.year})</option>
                ))}
              </select>
              {errors.season_id && <p className="mt-1 text-sm text-red-600">{errors.season_id}</p>}
            </div>
            <div>
              <label className={labelClass}>Event *</label>
              <select
                name="event_id"
                value={form.event_id}
                onChange={handleChange}
                className={inputClass}
                disabled={!!selectedEvent}
              >
                <option value="">Select Event</option>
                {availableEvents.map((ev) => (
                  <option key={ev._id || ev.id} value={ev._id || ev.id}>{ev.name || ev.title}</option>
                ))}
              </select>
              {errors.event_id && <p className="mt-1 text-sm text-red-600">{errors.event_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Prize Pool</label>
              <input
                name="prizePool"
                type="number"
                min={0}
                step={0.01}
                value={form.prizePool}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Min Team Members *</label>
              <input
                name="teamRequirements.minMembers"
                type="number"
                min={1}
                value={form.teamRequirements.minMembers}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.minMembers && <p className="mt-1 text-sm text-red-600">{errors.minMembers}</p>}
            </div>
            <div>
              <label className={labelClass}>Max Team Members *</label>
              <input
                name="teamRequirements.maxMembers"
                type="number"
                min={form.teamRequirements.minMembers}
                value={form.teamRequirements.maxMembers}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.maxMembers && <p className="mt-1 text-sm text-red-600">{errors.maxMembers}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Duration Value *</label>
              <input
                name="duration.value"
                type="number"
                min={1}
                value={form.duration.value}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>
            <div>
              <label className={labelClass}>Duration Unit *</label>
              <select name="duration.unit" value={form.duration.unit} onChange={handleChange} className={inputClass}>
                <option value="day">Day(s)</option>
                <option value="days">Days</option>
                <option value="week">Week(s)</option>
                <option value="hours">Hours</option>
                <option value="month">Month(s)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Banner Image {!competition && '*'}</label>
            {bannerImagePreview ? (
              <div className="relative group">
                <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                  <img
                    src={bannerImagePreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error'; }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="cursor-pointer p-2.5 bg-white/90 hover:bg-white rounded-full shadow-md">
                      <Upload className="w-5 h-5 text-slate-700" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleBannerImageChange} />
                    </label>
                    <button type="button" onClick={handleRemoveBannerImage} className="p-2.5 bg-white/90 hover:bg-white rounded-full shadow-md">
                      <X className="w-5 h-5 text-slate-700" />
                    </button>
                  </div>
                </div>
                {bannerImageFile && (
                  <p className="mt-1 text-xs text-slate-500">
                    File: {bannerImageFile.name} ({(bannerImageFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-slate-50/50 cursor-pointer transition-colors"
                onClick={() => document.getElementById('banner-image-input')?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 bg-slate-100 rounded-full">
                    <ImageIcon className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="text-sm text-slate-600">
                    <span className="text-blue-600 font-medium">Upload banner image</span>
                    <span className="mx-2 text-slate-500">or drag and drop</span>
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF, WebP up to 10MB</p>
                </div>
                <input id="banner-image-input" type="file" className="hidden" accept="image/*" onChange={handleBannerImageChange} />
              </div>
            )}
            {errors.bannerImage && <p className="mt-1 text-sm text-red-600">{errors.bannerImage}</p>}
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Download Titles</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-3">
                <input
                  value={downloadTitle}
                  onChange={(e) => setDownloadTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDownload(); } }}
                  placeholder="e.g., Rulebook, Terms & Conditions"
                  className={inputClass}
                />
              </div>
              <div className="flex items-end">
                <button type="button" onClick={handleAddDownload} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2 font-medium transition-colors">
                  <Plus size={16} /> Add Title
                </button>
              </div>
            </div>
            {form.downloadTitles.length > 0 && (
              <div className="space-y-2">
                {form.downloadTitles.map((title, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl">
                    <p className="text-slate-800 font-medium">{title}</p>
                    <button type="button" onClick={() => handleRemoveDownload(index)} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Rules and Regulations</label>
            <textarea
              name="rulesAndRegulations"
              value={form.rulesAndRegulations}
              onChange={handleChange}
              rows={4}
              placeholder="Enter competition rules and regulations"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Training Resource URL</label>
              <input name="trainingResourseUrl" value={form.trainingResourseUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Past Winner URL</label>
              <input name="pastWinnerUrl" value={form.pastWinnerUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Global Ranking URL</label>
              <input name="globalRankingeUrl" value={form.globalRankingeUrl} onChange={handleChange} placeholder="https://..." className={inputClass} />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Competition is Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="hasBots" checked={form.hasBots} onChange={handleChange} className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="text-sm text-slate-700">Has Bots</span>
            </label>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm font-medium">Please fix the errors above before submitting</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm">
              {competition ? 'Update Competition' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetitionFormModal;
