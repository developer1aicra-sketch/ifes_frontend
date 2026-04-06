import React from 'react';
import { ArrowLeft, Globe, Users, Trophy, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pathWithLocationPrefix } from '../utils/locationRoutes';
import { useLocationPrefix } from '../hooks/useLocationPrefix';

// Mock data for associations - replace with real data from your backend
const ASSOCIATIONS_DATA = [
  {
    id: 1,
    name: 'International Esports Federation',
    shortName: 'IESF',
    description: 'World governing body for esports, promoting competitive gaming globally.',
    country: 'South Korea',
    members: 130,
    year: 2008,
    logo: 'https://via.placeholder.com/100/3B82F6/FFFFFF?text=IESF',
    category: 'International'
  },
  {
    id: 2,
    name: 'Asian Electronic Sports Federation',
    shortName: 'AESF',
    description: 'Oversees esports development across Asia, organizing continental tournaments.',
    country: 'China',
    members: 45,
    year: 2005,
    logo: 'https://via.placeholder.com/100/10B981/FFFFFF?text=AESF',
    category: 'Continental'
  },
  {
    id: 3,
    name: 'European Esports Federation',
    shortName: 'EEF',
    description: 'Promotes esports in Europe with focus on fair play and athlete development.',
    country: 'Germany',
    members: 38,
    year: 2012,
    logo: 'https://via.placeholder.com/100/8B5CF6/FFFFFF?text=EEF',
    category: 'Continental'
  },
  {
    id: 4,
    name: 'Esports Federation of India',
    shortName: 'ESFI',
    description: 'Governing body for esports in India, recognized by Ministry of Electronics.',
    country: 'India',
    members: 28,
    year: 2016,
    logo: 'https://via.placeholder.com/100/EF4444/FFFFFF?text=ESFI',
    category: 'National'
  },
  {
    id: 5,
    name: 'British Esports Association',
    shortName: 'BEA',
    description: 'Promotes esports in education and supports grassroots development in UK.',
    country: 'United Kingdom',
    members: 25,
    year: 2016,
    logo: 'https://via.placeholder.com/100/EC4899/FFFFFF?text=BEA',
    category: 'National'
  },
  {
    id: 6,
    name: 'Japan Esports Union',
    shortName: 'JeSU',
    description: 'Official esports governing body in Japan, managing professional licensing.',
    country: 'Japan',
    members: 22,
    year: 2018,
    logo: 'https://via.placeholder.com/100/F59E0B/FFFFFF?text=JeSU',
    category: 'National'
  },
  {
    id: 7,
    name: 'United States Esports Federation',
    shortName: 'USEF',
    description: 'Fosters esports growth in USA with focus on collegiate and amateur circuits.',
    country: 'USA',
    members: 42,
    year: 2019,
    logo: 'https://via.placeholder.com/100/06B6D4/FFFFFF?text=USEF',
    category: 'National'
  },
  {
    id: 8,
    name: 'African Esports Association',
    shortName: 'AESA',
    description: 'Develops esports ecosystem across Africa with regional tournaments.',
    country: 'South Africa',
    members: 35,
    year: 2020,
    logo: 'https://via.placeholder.com/100/84CC16/FFFFFF?text=AESA',
    category: 'Continental'
  },
  {
    id: 9,
    name: 'Brazilian Esports Confederation',
    shortName: 'CBES',
    description: 'National governing body for esports in Brazil, recognized by government.',
    country: 'Brazil',
    members: 31,
    year: 2017,
    logo: 'https://via.placeholder.com/100/DC2626/FFFFFF?text=CBES',
    category: 'National'
  },
  {
    id: 10,
    name: 'Australian Esports Association',
    shortName: 'AESA',
    description: 'Promotes esports development and education across Australia.',
    country: 'Australia',
    members: 19,
    year: 2019,
    logo: 'https://via.placeholder.com/100/8B5CF6/FFFFFF?text=AESA',
    category: 'National'
  },
  {
    id: 11,
    name: 'Southeast Asian Esports Federation',
    shortName: 'SEAEF',
    description: 'Coordinates esports activities across Southeast Asian nations.',
    country: 'Singapore',
    members: 11,
    year: 2021,
    logo: 'https://via.placeholder.com/100/10B981/FFFFFF?text=SEAEF',
    category: 'Regional'
  },
  {
    id: 12,
    name: 'Middle East Esports Federation',
    shortName: 'MEEF',
    description: 'Advances esports in Middle Eastern countries with cultural integration.',
    country: 'UAE',
    members: 15,
    year: 2020,
    logo: 'https://via.placeholder.com/100/F59E0B/FFFFFF?text=MEEF',
    category: 'Regional'
  }
];

const AssociationsListView = () => {
  const navigate = useNavigate();
  const { locationPrefix } = useLocationPrefix();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');

  const categories = ['all', 'International', 'Continental', 'Regional', 'National'];

  const filteredAssociations = ASSOCIATIONS_DATA.filter(assoc => {
    const matchesSearch = assoc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assoc.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assoc.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || assoc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fadeIn pt-24 pb-20 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Back button */}
        <button
          onClick={() => navigate(pathWithLocationPrefix(locationPrefix || '', '/about/mission-vision'))}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Associates & Partners</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-6">
            <Users className="text-blue-600" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            List of Associations
          </h1>
          <p className="text-lg text-slate-500 max-w-3xl mx-auto">
            Explore our network of recognized sports associations and federations from around the world.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Globe className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{ASSOCIATIONS_DATA.length}</p>
                <p className="text-slate-500">Total Associations</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {[...new Set(ASSOCIATIONS_DATA.map(a => a.country))].length}
                </p>
                <p className="text-slate-500">Countries Represented</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {ASSOCIATIONS_DATA.reduce((sum, a) => sum + a.members, 0)}+
                </p>
                <p className="text-slate-500">Total Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search associations by name, country, or abbreviation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 19l-4-4m0-7A7 7 0 111 8a7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Showing {filteredAssociations.length} of {ASSOCIATIONS_DATA.length} associations
          </div>
        </div>

        {/* Associations Grid */}
        {filteredAssociations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">No associations found matching your criteria</div>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssociations.map(association => (
              <div
                key={association.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Association Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                        {association.logo ? (
                          <img
                            src={association.logo}
                            alt={association.shortName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-slate-700">
                            {association.shortName.substring(0, 2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {association.category}
                        </span>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
                          <MapPin size={12} />
                          {association.country}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                        {association.name}
                      </h3>
                      <p className="text-blue-600 font-semibold">{association.shortName}</p>
                    </div>
                  </div>
                </div>

                {/* Association Details */}
                <div className="p-6">
                  <p className="text-slate-600 mb-6 line-clamp-3">
                    {association.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Users size={16} />
                          <span>{association.members} members</span>
                        </div>
                        <div className="text-slate-500">
                          Est. {association.year}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        // You can add a detailed view modal or page here
                        console.log('View website:', association.id);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 group"
                    >
                      visit website
                      <ArrowLeft size={16} className="rotate-180 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-blue-50 rounded-xl px-6 py-4">
            <p className="text-slate-600">
              <span className="font-semibold">Note:</span> This list includes only recognized associations.
              Want to add your association?{' '}
              <button
                onClick={() => navigate('/associates/join-worso')}
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
              >
                Apply here
                <ArrowLeft size={16} className="rotate-180" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociationsListView;