/**
 * ============================================================
 *  MoveToHeal — Express Application Setup
 * ============================================================
 *
 *  This is the main Express app configuration file.
 *  It registers middleware, mounts routes, and sets up
 *  error handling.
 *
 *  ARCHITECTURE:
 *    /api/auth       → Authentication (register, login, verify)
 *    /api/diagnose   → Symptom analysis (Groq) + PDF report download
 *    /api/ai-scan    → AI model scan (Python .h5 → Groq enrichment)
 *    /api/history    → Diagnosis history CRUD
 *    /api/health     → Server health check
 *
 *  AUTH STATUS:
 *    ⚠️  Authentication is NOT enforced on any route currently.
 *    All diagnostic APIs are open access for development.
 *    TODO: Attach auth middleware to protected routes when ready.
 *
 * ============================================================
 */

import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// ─── Route Imports ─────────────────────────────────────────
import authRoutes      from './src/routes/auth.routes.js';
import diagnoseRoutes  from './src/routes/diagnose.routes.js';
import aiScanRoutes    from './src/routes/aiScan.routes.js';
import historyRoutes   from './src/routes/history.routes.js';

// ─── Path Setup ────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================================
// APP INITIALIZATION
// ============================================================
const app = express();

// ─── CORS ──────────────────────────────────────────────────
// Allow requests from the React dev server.
// TODO: Update origin for production deployment.
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));

// ─── Body Parsers ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ──────────────────────────────────────────
// Serves generated report PDFs and other public assets.
app.use('/public', express.static(join(__dirname, 'public')));

// ============================================================
// API ROUTES
// ============================================================

/**
 * Authentication — register, login, token verification
 * NOTE: Auth exists but is NOT enforced on other routes yet.
 */
app.use('/api/auth', authRoutes);

/**
 * Symptom Diagnosis — text-based symptom analysis via Groq LLM
 *   POST /api/diagnose        → Analyze symptoms
 *   POST /api/diagnose/report → Download PDF report
 *
 * ⚠️  No auth middleware — open access
 */
app.use('/api/diagnose', diagnoseRoutes);

/**
 * AI Model Scan — image-based diagnosis via Python .h5 models + Groq
 *   POST /api/ai-scan         → Upload image → model prediction → Groq report
 *   GET  /api/ai-scan/status  → Check Python AI service health
 *
 * ⚠️  No auth middleware — open access
 */
app.use('/api/ai-scan', aiScanRoutes);

/**
 * Diagnosis History — past diagnosis records
 *
 * ⚠️  No auth middleware — open access
 */
app.use('/api/history', historyRoutes);

/**
 * Health Check — simple server status endpoint
 */
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        service: 'MoveToHeal API',
        timestamp: new Date().toISOString(),
    });
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('[Server Error]', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
