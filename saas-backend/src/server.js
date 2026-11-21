const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');

const config = require('./config');
const { connectMongo, getMongoStatus } = require('./db/mongo');
const { authenticateTenant } = require('./middleware/auth');
const AIOpsCorrelationEngine = require('./aiops/correlationEngine');
const StaleCollectorWatchdog = require('./services/watchdog');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Liveness probe (public, no secrets or tenant data)
app.get('/healthz', (req, res) => {
  const mongoStatus = getMongoStatus();
  res.status(200).json({
    status: "HEALTHY",
    service: "CICADA Sentinel SaaS Platform",
    database: mongoStatus.isConnected ? "MongoDB Atlas (Connected)" : "MongoDB Atlas (Connecting)",
    mongoHost: mongoStatus.host,
    mongoDatabase: mongoStatus.dbName,
    readyState: mongoStatus.readyState,
    timestamp: new Date().toISOString()
  });
});

// AIOps Engine & Stale Watchdog
const correlationEngine = new AIOpsCorrelationEngine(io);
const watchdog = new StaleCollectorWatchdog(io);
watchdog.start();

// Socket.IO Room Joining by Tenant
io.on('connection', (socket) => {
  const tenantId = socket.handshake.query.tenantId || "TENANT-FINTECH-01";
  socket.join(tenantId);
  socket.emit("connected", { tenantId, status: "ONLINE", mongo: getMongoStatus() });
});

// Routes
const ingestionRoutes = require('./routes/ingestion')(correlationEngine, io);
const dashboardRoutes = require('./routes/dashboard')();
const remediationRoutes = require('./routes/remediation')(io);
const simulationRoutes = require('./routes/simulation');
const privacyShieldRoutes = require('./routes/privacyShield');

// Simulation & PrivacyShield routes mounted for demo and evaluation
app.use('/api/v1', simulationRoutes);
app.use('/api/v1/privacyshield', privacyShieldRoutes);
app.use('/api', simulationRoutes);
app.use('/api/privacyshield', privacyShieldRoutes);

// Ingestion API requires tenant & scoped credential authentication
app.use('/api/v1', authenticateTenant, ingestionRoutes);
app.use('/api/v1/dashboard', authenticateTenant, dashboardRoutes);
app.use('/api/v1', authenticateTenant, dashboardRoutes);
app.use('/api/v1', authenticateTenant, remediationRoutes);

// Aliases for /api routes (as requested in Phase 3 specification)
app.use('/api', authenticateTenant, ingestionRoutes);
app.use('/api/dashboard', authenticateTenant, dashboardRoutes);
app.use('/api', authenticateTenant, dashboardRoutes);
app.use('/api', authenticateTenant, remediationRoutes);

// Serve Static Frontend Dashboard on Port 5000
const frontendDistPath = path.join(__dirname, '../../saas-frontend/dist');

// Serve compiled assets; 404 immediately if an asset file does not exist (never fallback to index.html for assets)
app.use('/assets', express.static(path.join(frontendDistPath, 'assets'), {
  fallthrough: false
}));

app.use(express.static(frontendDistPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/healthz' || req.path.startsWith('/assets')) {
    return next();
  }
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", path: req.originalUrl });
});

server.listen(config.PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🛡️  CICADA Sentinel SaaS Platform running on port ${config.PORT}`);
  console.log(`📡 Ingestion Endpoint: http://localhost:${config.PORT}/api/v1/telemetry`);
  console.log(`📊 Dashboard API:     http://localhost:${config.PORT}/api/v1/dashboard/overview`);
  console.log(`⚡ WebSocket / Socket.IO ready`);
  
  // Connect to MongoDB Atlas
  await connectMongo(config.MONGODB_URI);
  console.log(`=======================================================`);
});

module.exports = { app, server };
