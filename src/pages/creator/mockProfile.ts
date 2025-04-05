const mockProfile = {
  id: 'mock-profile-id',
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  bio: 'Creative content creator passionate about storytelling',
  categories: ['Lifestyle', 'Tech', 'Travel'],
  social_links: {},
  portfolio: [],
  stats: {
    rating: 4.7
  },
  address: {},
  app_language: 'en',
  notification_preferences: {
    email: true,
    push: true,
    marketing: false
  },
  base_price: 299,
  interests: ['Tech', 'Lifestyle', 'Travel'],
  birthdate: '1995-05-15',
  location: {
    city: 'Berlin',
    country: 'Germany'
  },
  languages: [
    { code: 'en', name: 'English', proficiency: 'fluent' },
    { code: 'de', name: 'German', proficiency: 'native' },
    { code: 'fr', name: 'French', proficiency: 'basic' }
  ],
  personalInfo: {
    firstName: 'Max',
    lastName: 'Mustermann',
    address: 'Musterstraße 123, 10115 Berlin',
    phone: '+49 123 456789',
    email: 'max.mustermann@example.com'
  }
};

export default mockProfile;