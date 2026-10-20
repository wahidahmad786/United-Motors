const PLACES_API = 'https://places.googleapis.com/v1';

export async function getPlacePhotos({ apiKey, placeId }) {
  if (!apiKey) return { status: 503, body: { error: 'Google Places photo access is not configured.' } };
  if (!placeId) return { status: 500, body: { error: 'The Google Place ID is missing.' } };

  try {
    const detailsResponse = await fetch(`${PLACES_API}/places/${encodeURIComponent(placeId)}`, {
      headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'id,displayName,photos' },
      signal: AbortSignal.timeout(12000)
    });
    if (!detailsResponse.ok) throw new Error(`Google Places details returned ${detailsResponse.status}`);
    const place = await detailsResponse.json();
    const photos = Array.isArray(place.photos) ? place.photos.slice(0, 10) : [];
    const output = await Promise.all(photos.map(async photo => {
      // Photo resource names can expire and are deliberately fetched on demand without persistent caching.
      const mediaUrl = new URL(`${PLACES_API}/${photo.name}/media`);
      mediaUrl.searchParams.set('maxWidthPx', '1600');
      mediaUrl.searchParams.set('skipHttpRedirect', 'true');
      const mediaResponse = await fetch(mediaUrl, {
        headers: { 'X-Goog-Api-Key': apiKey },
        signal: AbortSignal.timeout(12000)
      });
      if (!mediaResponse.ok) return null;
      const media = await mediaResponse.json();
      if (!media.photoUri) return null;
      return {
        url: media.photoUri,
        width: photo.widthPx,
        height: photo.heightPx,
        authorAttributions: (photo.authorAttributions || []).map(author => ({
          name: author.displayName,
          url: author.uri ? new URL(author.uri, 'https://www.google.com').href : ''
        }))
      };
    }));
    return { status: 200, body: { placeName: place.displayName?.text || 'United Motors', photos: output.filter(Boolean) } };
  } catch (error) {
    console.error('Google Places photo request failed:', error.message);
    return { status: 502, body: { error: 'Google Places photos could not be loaded right now.' } };
  }
}

export async function placesPhotosHandler(req, res, options) {
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Allow: 'GET' });
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }
  const result = await getPlacePhotos(options);
  res.writeHead(result.status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, max-age=0' });
  res.end(JSON.stringify(result.body));
}
