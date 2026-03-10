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
    id: 'eldoret-game-night-pioneer',
    title: 'WAO Eldoret Game Night',
    image: '/EVENTS/WAO_ELDORET GAME NIGHT_SAT 21ST MARCH 2026.png',
    date: 'SAT 21ST MARCH, 2026',
    location: 'Pioneer, Eldoret',
    price: 'KES 500',
    description:
      'Join us for an exciting Game Night in Eldoret at Pioneer! Arrive at 4pm and enjoy gaming, fun activities, and great company until 11am the next day. Connect with fellow gamers and create lasting memories with the WAO community.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 500', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_ELDORET GAME NIGHT_SAT 21ST MARCH 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Pioneer+Eldoret&output=embed',
  },
  {
    id: 'prom-night-githegi',
    title: 'WAO Prom Night',
    image: '/EVENTS/WAO PROM NIGHT SAT 28TH MARCH 2026.png',
    date: 'SAT 28TH MARCH, 2026',
    location: 'Githegi Bay and Boat Resort',
    price: 'KES 1000',
    description:
      'Join us for an elegant Prom Night at Githegi Bay and Boat Resort! Dress to impress, dance the night away, enjoy great music, delicious food, and create unforgettable memories with the WAO community.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 1000', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO PROM NIGHT SAT 28TH MARCH 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Githegi+Bay+and+Boat+Resort&output=embed',
  },
  {
    id: 'kisumu-meetup-valley-view',
    title: 'WAO Kisumu Meetup',
    image: '/EVENTS/WAO_KISUMU MEETUP_VALLEY VIEW RESORT SAT 28TH MARCH.png',
    date: 'SAT 28TH MARCH, 2026',
    location: 'Valley View Resort, Kiboswa',
    price: 'KES 150',
    description:
      'Connect with the WAO community in Kisumu! Join us at Valley View Resort for a day of fun activities, networking, great food, and building lasting friendships in a beautiful lakeside setting.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 150', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_KISUMU MEETUP_VALLEY VIEW RESORT SAT 28TH MARCH.png'],
    mapEmbed: 'https://www.google.com/maps?q=Valley+View+Resort+Kiboswa+Kisumu&output=embed',
  },
  {
    id: 'wrc-safari-rally-naivasha',
    title: 'WAO WRC Safari Rally',
    image: '/EVENTS/WAO_WRC SAFARI RALLY 14TH AND 15TH MARCH 2026.png',
    date: 'SAT 14TH - SUN 15TH MARCH, 2026',
    location: 'Naivasha',
    price: 'KES 1800',
    description:
      'Experience the thrill of the WRC Safari Rally with WAO! Join us for an exciting 2-day adventure in Naivasha, watch world-class rally action, camp under the stars, and bond with fellow motorsport enthusiasts.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 1800', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_WRC SAFARI RALLY 14TH AND 15TH MARCH 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Naivasha+Kenya&output=embed',
  },
  {
    id: 'game-night-utawala',
    title: 'WAO Game Night',
    image: '/EVENTS/WAO_GameNight_2026.jpeg',
    date: 'SAT 21ST FEB - SUN 22ND FEB, 2026 11:00AM - 11:00AM',
    location: 'La Mana City, Utawala',
    price: 'KES 750',
    description:
      'Join us for an epic 24-hour Game Night at La Mana City in Utawala! Experience non-stop gaming, connect with fellow gamers, enjoy great food, and build lasting friendships in this exciting gaming marathon.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 750', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_GameNight_2026.jpeg'],
    mapEmbed: 'https://www.google.com/maps?q=La+Mana+City+Utawala&output=embed',
  },
  {
    id: 'eldoret-picnic-kenmosa',
    title: 'We Are One Eldoret Picnic',
    image: '/EVENTS/WAO_Eldoret_KENMOSA.jpeg',
    date: 'SAT 28TH FEB, 2026 10:00AM',
    location: 'Kenmosa Resort, Eldoret',
    price: 'KES 150',
    description:
      'Join us for an exciting picnic day at Kenmosa Resort in Eldoret! Connect with the WAO community, enjoy outdoor activities, delicious food, and build meaningful relationships in a beautiful resort setting.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 150', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_Eldoret_KENMOSA.jpeg'],
    mapEmbed: 'https://www.google.com/maps?q=Kenmosa+Resort+Eldoret&output=embed',
  },
  {
    id: 'kisumu-hangout-resort',
    title: 'Kisumu Hangout',
    image: '/EVENTS/WAO_Kisumu-Meetup.jpg',
    date: 'SUN 19TH OCT, 2025 9:00AM - 6:00PM',
    location: 'Valley View Resort, Kisumu',
    price: 'KES 0',
    description:
      'Join us for an exciting day at Valley View Resort in Kisumu! Connect with the WAO community, enjoy activities, and build meaningful relationships in a beautiful resort setting.',
    host: 'WE ARE ONE',
    tickets: [{ name: 'General Admission', price: 'KES 0', status: 'Available' }],
    photos: ['/EVENTS/WAO_Kisumu-Meetup.jpg'],
    mapEmbed: 'https://www.google.com/maps?q=Valley+View+Resort+Kisumu&output=embed',
  },
  {
    id: 'kanunga-falls',
    title: 'Kanunga Falls Meetup',
    image: '/EVENTS/WAO_NatureTrail.jpg',
    date: 'SUNDAY 12TH OCT, 2025 10:00AM - 6:00PM',
    location: 'Kanunga Falls',
    price: 'KES 1600',
    description:
      'Join us for an adventurous day at Kanunga Falls! Experience the beauty of nature, enjoy hiking, and connect with the WAO community in this stunning waterfall setting.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 1600', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_NatureTrail.jpg'],
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



