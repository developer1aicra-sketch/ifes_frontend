import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COMPETITIONS = [
  'Robo Race Challenge',
  'Robosoccer Challenge',
  'BotCombat Challenge',
  'Innovation Contest',
];

const TeamFormModal = ({ show, onClose, onSubmit, team = null, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    competition: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (team && mode === 'edit') {
      setFormData({
        name: team.name || '',
        competition: team.competition || '',
        description: team.description || '',
      });
    } else {
      setFormData({
        name: '',
        competition: '',
        description: '',
      });
    }
    setErrors({});
  }, [team, mode, show]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required';
    }
    if (!formData.competition) {
      newErrors.competition = 'Competition is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            {mode === 'create' ? 'Create New Team' : 'Edit Team'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="Enter team name"
              className={`w-full bg-slate-800 border ${
                errors.name ? 'border-red-500' : 'border-slate-600'
              } text-white rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              {mode === 'create' ? 'Create Team' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamFormModal;
