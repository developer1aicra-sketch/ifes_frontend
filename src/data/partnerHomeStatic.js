/**
 * Static fallback data for Partner home sections (Video, News, Supporter).
 * Used when API returns empty or partner home is not yet loaded.
 * Replace with API data when available.
 */

export const PARTNER_HOME_STATIC = {
  videos: [
    {
      _id: 'static-video-1',
      title: 'Technoxian World Cup 2025 Highlights',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isActive: true,
    },
    {
      _id: 'static-video-2',
      title: 'Robotics Championship Finals – Best Moments',
      youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      isActive: true,
    },
    {
      _id: 'static-video-3',
      title: 'WORSO Global – Introduction to the Sport of Robotics',
      youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      isActive: true,
    },
  ],

  news: [
    {
      _id: 'static-news-1',
      title: 'Technoxian 2026 Registrations Open',
      description: 'Registrations for the next Technoxian World Cup are now open. Teams from over 95 nations can apply. Early bird discounts available until next month.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
      type: 'EVENT',
      isActive: true,
    },
    {
      _id: 'static-news-2',
      title: 'New Rulebook Update – Season 2025-26',
      description: 'WORSO has released the updated rulebook for the 2025-26 season. Key changes include revised scoring for autonomous rounds and updated safety guidelines.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      type: 'REGULATION',
      isActive: true,
    },
    {
      _id: 'static-news-3',
      title: 'Partner Chapter Launch in New Region',
      description: 'We are excited to announce the launch of a new partner chapter. Local events and qualifiers will be announced soon. Stay tuned for updates.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      type: 'GENERAL',
      isActive: true,
    },
  ],

  supporters: [
    {
      _id: 'static-supporter-1',
      name: 'Tech Education Foundation',
      logo: 'https://placehold.co/160x64?text=Tech+Edu',
      website: 'https://www.example.com',
      isActive: true,
    },
    {
      _id: 'static-supporter-2',
      name: 'Robotics Association',
      logo: 'https://placehold.co/160x64?text=Robotics',
      website: 'https://www.example.com',
      isActive: true,
    },
    {
      _id: 'static-supporter-3',
      name: 'STEM Partners',
      logo: 'https://placehold.co/160x64?text=STEM',
      website: 'https://www.example.com',
      isActive: true,
    },
    {
      _id: 'static-supporter-4',
      name: 'Innovation Hub',
      logo: 'https://placehold.co/160x64?text=Innovation',
      website: 'https://www.example.com',
      isActive: true,
    },
  ],
};
