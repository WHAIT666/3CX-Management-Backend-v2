import express from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger-spec';
import authRoutes from './routes/auth.routes';
import centralRoutes from './routes/central.routes';
import dashboardRoutes from './routes/admin.routes'; // Import the dashboard routes

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests for CORS
app.use(express.json()); // Enable parsing JSON bodies

// Register routes
app.use('/api/auth', authRoutes); // Authentication-related routes
app.use('/api', centralRoutes);    // Other central API routes
app.use('/api', dashboardRoutes);  // Admin dashboard-related routes (including /dashboard-stats)

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Get the port from config or set default to 5000
const port = config.get('port') || 5000;

// Start the server and connect to the database
app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  log.info(`Swagger docs available at http://localhost:${port}/api-docs`);
  connectToDb(); // Connect to the database
});

export default app;
