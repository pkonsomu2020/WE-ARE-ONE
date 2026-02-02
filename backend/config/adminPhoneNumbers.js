/**
 * Complete mapping of all WAO admin phone numbers
 * This file contains the exact phone numbers for all administrators
 */

const ADMIN_PHONE_NUMBERS = {
  // Super Admin
  'admin@weareone.co.ke': '+254745343256',
  
  // Regular Admins
  'stacyagwanda@gmail.com': '0769357562',
  'stellakirioba@gmail.com': '0748843957',
  'muriukivapour@gmail.com': '0725422407',
  'rachaellucas94@gmail.com': '0741057186',
  'cruzeltone@gmail.com': '0711853928',
  'daisymary1190@gmail.com': '0758646028',
  'apollopondi99@gmail.com': '0797522400',
  'gloriankatheu@gmail.com': '0725381452',
  'kevindoc254@gmail.com': '0727154737',
  'kevinkoechx@gmail.com': '0715987339',
  'malikaprodl007@gmail.com': '0758644004',
  'pkonsomu2021@gmail.com': '0745343256'
};

const ADMIN_PROFILES = {
  1: { name: 'WAO Admin', email: 'admin@weareone.co.ke', phone: '+254745343256', role: 'Super Admin' },
  2: { name: 'Stacy Agwanda Jacinta', email: 'stacyagwanda@gmail.com', phone: '0769357562', role: 'Admin' },
  3: { name: 'Stella Brenda Nyanchama', email: 'stellakirioba@gmail.com', phone: '0748843957', role: 'Admin' },
  4: { name: 'Muriuki V Linnet', email: 'muriukivapour@gmail.com', phone: '0725422407', role: 'Admin' },
  5: { name: 'Rachael Madawa Lucas', email: 'rachaellucas94@gmail.com', phone: '0741057186', role: 'Admin' },
  6: { name: 'Cruzz Eltone', email: 'cruzeltone@gmail.com', phone: '0711853928', role: 'Admin' },
  7: { name: 'Mary Deckline', email: 'daisymary1190@gmail.com', phone: '0758646028', role: 'Admin' },
  8: { name: 'Apollo Apondi', email: 'apollopondi99@gmail.com', phone: '0797522400', role: 'Admin' },
  9: { name: 'Glorian Katheu', email: 'gloriankatheu@gmail.com', phone: '0725381452', role: 'Admin' },
  10: { name: 'Brian Kevin Mwangi', email: 'kevindoc254@gmail.com', phone: '0727154737', role: 'Admin' },
  11: { name: 'Kevin Koech', email: 'kevinkoechx@gmail.com', phone: '0715987339', role: 'Admin' },
  12: { name: 'Daniel Mahmoud Alli Anicethy Prodl', email: 'malikaprodl007@gmail.com', phone: '0758644004', role: 'Admin' },
  13: { name: 'Peter Onsomu', email: 'pkonsomu2021@gmail.com', phone: '0745343256', role: 'Admin' }
};

/**
 * Get admin phone number by email
 * @param {string} email - Admin email address
 * @returns {string} Phone number or default
 */
function getAdminPhoneByEmail(email) {
  return ADMIN_PHONE_NUMBERS[email] || '+254700000000';
}

/**
 * Get admin profile by ID
 * @param {number} id - Admin profile ID
 * @returns {object} Admin profile or null
 */
function getAdminProfileById(id) {
  return ADMIN_PROFILES[id] || null;
}

/**
 * Get admin profile by email
 * @param {string} email - Admin email address
 * @returns {object} Admin profile or null
 */
function getAdminProfileByEmail(email) {
  return Object.values(ADMIN_PROFILES).find(profile => profile.email === email) || null;
}

module.exports = {
  ADMIN_PHONE_NUMBERS,
  ADMIN_PROFILES,
  getAdminPhoneByEmail,
  getAdminProfileById,
  getAdminProfileByEmail
};