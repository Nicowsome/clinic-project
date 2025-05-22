"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const errorHandler_1 = require("./middleware/errorHandler");
const patientRoutes_1 = __importDefault(require("./routes/patientRoutes"));
const medicalRecordRoutes_1 = __importDefault(require("./routes/medicalRecordRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
// Load environment variables
dotenv_1.default.config({ path: '.env' });
// Create Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers with enhanced Content Security Policy
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://*"],
            connectSrc: ["'self'", process.env.CORS_ORIGIN || 'http://localhost:5173']
        }
    },
    xssFilter: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    hsts: {
        maxAge: 15552000, // 180 days in seconds
        includeSubDomains: true,
        preload: true
    }
}));
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Limit requests from same API
const limiter = (0, express_rate_limit_1.default)({
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
// Prevent parameter pollution
app.use((0, hpp_1.default)({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price'
    ]
}));
// Enable CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
// Request time middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// 3) ROUTES
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/patients', patientRoutes_1.default);
app.use('/api/v1/medical-records', medicalRecordRoutes_1.default);
app.use('/api/v1/notifications', notificationRoutes_1.default);
// 4) ERROR HANDLING MIDDLEWARE
app.use(errorHandler_1.errorHandler);
// 5) START SERVER
const DB = process.env.MONGODB_URI?.replace('<PASSWORD>', process.env.MONGODB_PASSWORD || '') || 'mongodb://localhost:27017/clinic-management';
mongoose_1.default
    .connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
// Handle SIGTERM
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated!');
    });
});
