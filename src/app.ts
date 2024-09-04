import express from 'express';
import config from 'config';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import connectToDb from './utils/connectToDb';
import log from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './utils/swagger-spec';
import authRoutes from './routes/auth.routes';
import centralRoutes from './routes/central.routes';

const app = express();

app.use(cookieParser()); // Use cookie-parser middleware

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', centralRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = config.get('port');

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);
  log.info(`Swagger docs available at http://localhost:${port}/api-docs`);
  connectToDb();
});

export default app;
