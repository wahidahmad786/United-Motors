// Details below were supplied in the owner's website brief. Confirm current accuracy before launch.
const latitude = 30.2813862;
const longitude = 78.0009866;
const placeId = 'ChIJBVP9YncrCTkRsnzL8bNzyHs';

export const business = {
  name: 'United Motors',
  city: 'Dehradun',
  region: 'Uttarakhand',
  postalCode: '248001',
  country: 'India',
  serviceArea: 'Dehradun and surrounding areas',
  phone: '+917895988795',
  phoneVerifiedByOwner: false,
  whatsapp: '', // Keep blank until the owner confirms this number is WhatsApp-enabled.
  whatsappMessage: 'Hello United Motors, I found your website and would like to enquire about your car service. Please assist me.',
  email: '',
  address: 'C-15, Turner Road, Opposite Little Stanford School, Dehradun, Uttarakhand 248001, India',
  hours: [],
  location: { latitude, longitude, placeId },
  mapsUrl: 'https://www.google.co.in/maps/place/United+Motors/@30.2813862,77.9984117,17z/data=!3m1!4b1!4m6!3m5!1s0x39092b7762fd5305:0x7bc873b3f1cb7cb2!8m2!3d30.2813862!4d78.0009866!16s%2Fg%2F11rc7r4144?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D',
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${latitude}%2C${longitude}&destination_place_id=${placeId}`,
  embedMapUrl: `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`,
  social: { instagram: '', facebook: '' },
  siteUrl: '', // set this when the production domain is known
  insurancePartners: [],
  ownerPhotosDirectory: '/images/workshop/'
};
