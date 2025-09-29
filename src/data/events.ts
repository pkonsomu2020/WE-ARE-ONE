export interface EventItem {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  price: string;
  description?: string;
  host?: string;
  tickets?: Array<{ name: string; price: string; status: string }>
  photos?: string[];
  mapEmbed?: string;
}

export const events: EventItem[] = [
  {
    id: 'kanunga-falls',
    title: 'Kanunga Falls Meetup',
    image: '/EVENTS/WAO_KanungaFalls.jpg',
    date: 'SUNDAY 12TH OCT, 2025 10:00AM - 6:00PM',
    location: 'Kanunga Falls',
    price: 'KES 1600',
    description:
      'Join us for an adventurous day at Kanunga Falls! Experience the beauty of nature, enjoy hiking, and connect with the WAO community in this stunning waterfall setting.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 1600', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_KanungaFalls.jpg'],
    mapEmbed: 'https://www.google.com/maps?q=Kanunga+Falls&output=embed',
  },
  {
    id: 'kisumu-hangout',
    title: 'Kisumu Hangout Day',
    image: '/EVENTS/WAO_KisumuHangout.jpg',
    date: 'SAT 27TH SEPT, 2025 10:00AM - 5:00PM',
    location: 'Victoria Park, behind Huduma Center',
    price: 'KES 0',
    description:
      'Join us for a fun-filled day in Kisumu! Connect with the WAO community, enjoy activities, and build meaningful relationships in a beautiful park setting.',
    host: 'WE ARE ONE',
    tickets: [{ name: 'General Admission', price: 'KES 0', status: 'Available' }],
    photos: ['/EVENTS/WAO_KisumuHangout.jpg'],
    mapEmbed: 'https://www.google.com/maps?q=Victoria+Park+Kisumu&output=embed',
  },
  {
    id: 'mombasa-hangout',
    title: 'Mombasa Hangout Day',
    image: '/EVENTS/WAO_MombasaHangout.jpg',
    date: 'SAT 27TH SEPT, 2025 9:00AM - 6:30PM',
    location: 'Treasury Square, Opposite The Governors Office',
    price: 'KES 0',
    description:
      'Join us for an exciting day in Mombasa! Connect with fellow community members, share experiences, and build meaningful relationships in a beautiful coastal setting.',
    host: 'WE ARE ONE',
    tickets: [{ name: 'General Admission', price: 'KES 0', status: 'Available' }],
    photos: ['/EVENTS/WAO_MombasaHangout.jpg'],
    mapEmbed: 'https://www.google.com/maps?q=Treasury+Square+Mombasa&output=embed',
  },
  {
    id: 'nature-trail',
    title: 'Nature Trail Walk and Fun',
    image: '/EVENTS/WAO_NatureTrail.jpg',
    date: 'SAT 20TH SEPT, 2025 10:00AM - 6:00PM',
    location: 'Oololua Nature Trail',
    price: 'KES 0',
    description:
      'Join us for a refreshing day outdoors at Oololua Nature Trail. Enjoy a scenic walk, fun activities, and connect with the WAO community in nature.',
    host: 'WE ARE ONE',
    tickets: [{ name: 'General Admission', price: 'KES 0', status: 'Available' }],
    photos: ['/EVENTS/WAO_NatureTrail.jpg'],
    mapEmbed: 'https://www.google.com/maps?q=Oloolua+Nature+Trail&output=embed',
  },
  {
    id: 'food-drive',
    title: 'WAO Food Drive',
    image: '/EVENTS/WAO_Food Drive.jpg',
    date: 'JUNE 1ST - JULY 31ST 2025',
    location: 'Community Center, Nairobi',
    price: 'KES 0',
    description:
      'Join us for the WAO Food Drive to support our community with essential food supplies. Everyone is welcome!',
    host: 'WE ARE ONE',
    tickets: [{ name: 'General Admission', price: 'KES 0', status: 'Available' }],
    photos: ['/EVENTS/WAO_Food Drive.jpg'],
    mapEmbed: 'https://maps.google.com/maps?q=Nairobi&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },
  {
    id: 'movie-night',
    title: 'WAO Movie Night',
    image: '/EVENTS/WAO_Movie-Night.jpg',
    date: 'Saturday September 6th | 7pm',
    location: 'Anga Cinema, Diamond Plaza II - Parklands',
    price: 'KES 800',
    description:
      'Enjoy a fun-filled evening under the stars with great movies and company at the WAO Movie Night.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'WAO Members', price: 'KES 800', status: 'Available' },
      { name: 'Public', price: 'KES 1000', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_Movie-Night.jpg'],
    mapEmbed:
      'https://www.google.com/maps?q=Anga+Cinema+Diamond+Plaza+II,+Parklands&output=embed',
  },
  {
    id: 'mombasa-meetup',
    title: 'WE ARE ONE MEET-UP, MOMBASA',
    image: '/EVENTS/WAO_MombasaMeetup.jpg',
    date: 'SAT 16TH AUGUST, 2025 10:00AM - 7:00PM',
    location: 'MAMA NGINA WATERFRONT',
    price: 'KES 0',
    description:
      'Join us for an exciting meet-up in Mombasa! Connect with fellow community members, share experiences, and build meaningful relationships in a beautiful waterfront setting.',
    host: 'WE ARE ONE',
    tickets: [{ name: 'General Admission', price: 'KES 0', status: 'Available' }],
    photos: ['/EVENTS/WAO_MombasaMeetup.jpg'],
    mapEmbed: 'https://maps.google.com/maps?q=Mama+Ngina+Waterfront,+Mombasa&output=embed',
  },
];

export function getEventById(id?: string): EventItem | undefined {
  if (!id) return undefined;
  return events.find((e) => e.id === id);
}



