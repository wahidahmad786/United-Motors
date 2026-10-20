import { defineConfig, loadEnv } from 'vite';
import { placesPhotosHandler } from './server/google-places.js';
import { business } from './src/config/business.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.PLACES_API_KEY || process.env.PLACES_API_KEY || '';
  return {
    // Three.js is isolated in a lazy homepage-only chunk; its production transfer is about 131 KB gzip.
    build: { chunkSizeWarningLimit: 550 },
    server: {
      configureServer(server) {
        server.middlewares.use('/api/places-photos', (req, res) => placesPhotosHandler(req, res, { apiKey, placeId: business.location.placeId }));
      }
    }
  };
});
