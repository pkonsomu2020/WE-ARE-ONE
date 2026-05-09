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
    id: 'kisumu-game-night-may',
    title: 'WAO Kisumu Game Night',
    image: '/EVENTS/WAO_KISUMU_GAME NIGHT_SAT 16TH - SUN 17TH MAY 2026.png',
    date: 'SAT 16TH - SUN 17TH MAY, 2026',
    location: 'Milimani, Kisumu',
    price: 'KES 800',
    description:
      'Join us for an epic 2-day Game Night in Kisumu! Starting at 3PM on Saturday, enjoy non-stop gaming, connect with fellow gamers, and build lasting friendships with the WAO community in Milimani.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 800', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO_KISUMU_GAME NIGHT_SAT 16TH - SUN 17TH MAY 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Milimani+Kisumu&output=embed',
  },
  {
    id: 'mothers-club-event-may',
    title: 'WAO Mothers Club Event',
    image: '/EVENTS/WAO MOTHERS CLUB EVENT SUNDAY MAY 24TH 2026.png',
    date: 'SUN 24TH MAY, 2026',
    location: 'Uhuru Park, Nairobi',
    price: 'KES 350',
    description:
      'Celebrate motherhood with the WAO community! Join us from 12PM at Uhuru Park for a special Mothers Club Event. Connect with fellow mothers, enjoy activities, and create beautiful memories together.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 350', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO MOTHERS CLUB EVENT SUNDAY MAY 24TH 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Uhuru+Park+Nairobi&output=embed',
  },
  {
    id: 'nakuru-potluck-hangout-may',
    title: 'WAO Nakuru Potluck Hangout',
    image: '/EVENTS/WAO NAKURU POTLUCK MEETUP HANGOUT SAT 16TH MAY 2026.png',
    date: 'SAT 16TH MAY, 2026',
    location: 'BnB Mawangaa, Nakuru',
    price: 'KES 1000',
    description:
      'Join us for a delightful Potluck Hangout in Nakuru! Bring your favorite dish, share great food, connect with the WAO community, and enjoy a memorable day at BnB Mawangaa.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 1000', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO NAKURU POTLUCK MEETUP HANGOUT SAT 16TH MAY 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=BnB+Mawangaa+Nakuru&output=embed',
  },
  {
    id: 'eldoret-picnic-hangout-may',
    title: 'Picnic FT Potluck Hangout',
    image: '/EVENTS/WAO ELDORET PICNIC HANGOUT 27TH MAY 2026.png',
    date: 'WED 27TH MAY, 2026',
    location: 'Kenmosa Village, Eldoret',
    price: 'KES 300',
    description:
      'Join us for a fun-filled Picnic and Potluck Hangout in Eldoret! Starting from 10AM at Kenmosa Village, enjoy outdoor activities, delicious food, and connect with the WAO community in a beautiful setting.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'KES 300', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO ELDORET PICNIC HANGOUT 27TH MAY 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Kenmosa+Village+Eldoret&output=embed',
  },
  {
    id: 'karura-meetup-may',
    title: 'WAO Karura Meetup - May We Bloom',
    image: '/EVENTS/WAO NAIROBI MEETUP KARURA SAT 30TH MAY 2026.png',
    date: 'SAT 30TH MAY, 2026',
    location: 'Karura Forest, Nairobi',
    price: 'TBD',
    description:
      'Join us for the "May We Bloom" themed meetup at Karura Forest! Connect with nature and the WAO community, enjoy a refreshing day outdoors, and build meaningful relationships in this beautiful forest setting.',
    host: 'WE ARE ONE',
    tickets: [
      { name: 'Standard', price: 'TBD', status: 'Available' }
    ],
    photos: ['/EVENTS/WAO NAIROBI MEETUP KARURA SAT 30TH MAY 2026.png'],
    mapEmbed: 'https://www.google.com/maps?q=Karura+Forest+Nairobi&output=embed',
  },

];

export function getEventById(id?: string): EventItem | undefined {
  if (!id) return undefined;
  return events.find((e) => e.id === id);
}



