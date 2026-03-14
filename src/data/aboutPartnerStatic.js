/**
 * Static content for the Partner About page.
 * Used when viewing /:locationCode/about (partner route).
 * Single "About" page with no sub-sections.
 */

export const ABOUT_PARTNER_STATIC = {
  title: 'About',
  subtitle: 'Championing the Future of Competitive Robotics',
  hero: {
    eyebrow: 'About',
    heading: 'World Robotics Sports Organization',
    tagline: 'Your local partner in robotics and technology sports.',
  },
  intro: `We are part of the World Robotics Sports Organization (WORSO) network, bringing competitive robotics and technology sports to our region. Our mission is to promote fair play, foster talent, and connect our community with global standards and events.`,

  sections: [
    {
      id: 'mission',
      title: 'Our Mission',
      content: `To develop and promote robotics sports at the grassroots level, provide a clear pathway to national and international competition, and ensure every participant has access to safe, fair, and inclusive events.`,
    },
    {
      id: 'what-we-do',
      title: 'What We Do',
      points: [
        'Organize and sanction local and regional robotics competitions.',
        'Support teams and players with training and rulebooks aligned with WORSO standards.',
        'Connect our community with world championships and international opportunities.',
        'Advocate for recognition of robotics sports in education and society.',
      ],
    },
    {
      id: 'join',
      title: 'Get Involved',
      content: `Whether you are a team, a school, or an enthusiast—join our community. Participate in events, become a member, or volunteer. Together we grow the sport of robotics.`,
    },
  ],
};
