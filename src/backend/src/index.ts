import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  handleGetCategories,
  handleGetProducts,
  handleGetProductById,
  handleSearch,
  handleSynergyCheck,
  handleHealthCheck
} from './controllers/apiController';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS & JSON Request Body Parsing
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.get('/health', handleHealthCheck);
app.get('/api/v1/health', handleHealthCheck);

app.get('/api/v1/categories', handleGetCategories);
app.get('/api/v1/products', handleGetProducts);
app.get('/api/v1/products/:id', handleGetProductById);
app.get('/api/v1/search', handleSearch);
app.post('/api/v1/synergy/check', handleSynergyCheck);

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found.'
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Hi-Fi Shop REST API Microservice running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health Check: http://localhost:${PORT}/api/v1/health`);
    console.log(`=======================================================`);
  });
}

export default app;
