// server.js
import { handler as ssrHandler } from './dist/server/entry.mjs';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4321;

const app = express();

// Serve static files from the dist/client directory
app.use(express.static(join(__dirname, 'dist/client')));

// Use the SSR handler for all other requests
app.use(ssrHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
});
