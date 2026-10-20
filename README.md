# United Motors website

A responsive, photography-led website for United Motors in Dehradun. The project uses Vite and vanilla JavaScript, with a small Node server for the optional Google Places photo endpoint.

## Run locally

- Install Node.js 20 or newer and run `npm install`.
- Run `npm run dev` to use Vite. The local API endpoint returns a clear unconfigured response until `PLACES_API_KEY` is set in `.env`.
- Run `npm run build` to create `dist/`.
- Run `npm start` to serve the production build and `/api/places-photos` from the Node server on port 3000 (or `PORT` in `.env`).
- `npm run preview` serves only the static build and does not provide the Places photo API.

The production server serves clean routes such as `/services`, `/about`, and `/contact` with the app fallback. Deploy the built files and Node server together if using Google Places photos; static-only deployment still works with the illustrative/local gallery.

## Business details to confirm

The address, Google Maps listing, coordinates, Place ID, and phone number were entered from the supplied brief. The owner should confirm each detail, map pin, and call number before launch. The phone is used for tap-to-call but is marked unverified in the structured data until `phoneVerifiedByOwner` is changed to `true`. WhatsApp remains unavailable until the owner separately confirms a WhatsApp-enabled number in `src/config/business.js`. Do not infer WhatsApp availability from a phone number. Add verified hours, email, social accounts, and production domain only when provided by the workshop.

## Google Maps and Places photos

The Contact page and floating location panel include Google Maps embeds, profile and directions links, tap-to-call, and an opt-in straight-line distance estimate. The estimate requests location only after the visitor selects the button; road distance and travel time are left to Google Maps Directions. Google Maps URLs work without an API key.

To enable Google Maps listing photos:

1. Enable Places API (New) for a Google Cloud project and configure billing and usage limits.
2. Create a key restricted to the Places API and the production server environment. Put it in `.env` as `PLACES_API_KEY`; never expose it as a `VITE_` variable or commit `.env`.
3. Publish public Terms of Use and Privacy Policy that meet Google Maps Platform requirements before enabling Places content in production.
4. Confirm the configured Place ID identifies the intended United Motors listing.

The server requests place details and at most ten photo resources on demand, renders photo contributor attributions, and disables caching for these API responses. Follow current Google Maps Platform rules for attribution, permitted use, storage, and retention. Photos returned by Places are served with Google Maps text attribution and contributor credits. See [Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/place-photos) and [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies). The profile/directions links use [Google Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), which do not require a key.

## Workshop photos and gallery

Only photos supplied or authorized by United Motors should be represented as the workshop's own work. Put them under `public/images/workshop/` and add entries to `src/config/gallery.js`. Include accurate captions and alt text. Do not upload customer/vehicle images without permission. Existing Unsplash images remain clearly marked as illustrative stock photography and are not described as completed United Motors projects; retain their license obligations if redistributing them.

## Pages and content

Available routes: `/`, `/services`, `/services/<service-name>`, `/about`, `/gallery`, `/insurance`, and `/contact`. Confirm wheel-alignment, PDR, chassis-alignment and diagnostic-scanning availability before publishing if any are not offered. Insurance language does not promise claim approval, cashless processing or insurer partnership.

## SEO and domain

Titles, descriptions, Open Graph basics, and AutoRepair structured data are provided. Set `business.siteUrl` before deployment; the production build then generates an absolute sitemap and adds its URL to `robots.txt`. No domain or canonical URL is invented when the site URL is unset.
