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



