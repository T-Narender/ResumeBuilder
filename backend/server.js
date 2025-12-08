import cors from "cors";
import 'dotenv/config';
import express from "express";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/userRouter.js";
import resumeRouter from "./routes/resumeRoutes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 30001;


app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://airesumebuilder-eight.vercel.app']
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
// Connect to database
connectDB();

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', userRouter);
app.use('/api/resumes', resumeRouter);

app.use(
    '/uploads',
    express.static(path.join(__dirname, '/uploads'), {
        setHeaders: (res, _path) => {
            res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        }
    })
);

// Root route
app.get('/', (req, res) => {
    res.send('Hello from backend');
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);

    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            message: 'Validation Error',
            errors: errors
        });
    }

    if (err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate field value entered'
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired'
        });
    }

    res.status(err.statusCode || 500).json({
        message: err.message || 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({
        message: `Route ${req.originalUrl} not found`
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});