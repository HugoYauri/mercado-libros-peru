import app from './src/app.js';
import { env } from './src/config/env.js';
export default app;
if (!process.env.VERCEL) app.listen(env.port, () => console.log(`API disponible en http://localhost:${env.port}/api/health`));
