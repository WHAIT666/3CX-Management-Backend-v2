import 'dotenv/config';
import express from 'express';
import config from 'config';
import cors from 'cors';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';
import router from './routes';
import deserializeUser from './middleware/deserializeUser';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger-spec';

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', '3cxAccessToken'],
  credentials: true, // If you need to pass cookies or HTTP authentication
};

// Use CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

app.use(deserializeUser);

app.use(router);

// Setup Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = config.get('port');

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  log.info(`Swagger docs available at http://localhost:${port}/api-docs`);
  connectToDb();
});

export default app;
