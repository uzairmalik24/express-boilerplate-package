import { errorResponse, serverErrorResponse } from '../services/response.service.js';

// ────────────────────────────────────────────────
// GLOBAL ERROR HANDLER MIDDLEWARE
// ────────────────────────────────────────────────
export const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        statusCode: err.statusCode,
        // Add more context if needed: req.method, req.originalUrl, etc.
    });

    // ────────────────────────────────────────────────
    // 1. PRISMA ERRORS (PostgreSQL, MySQL, SQLite via Prisma)
    // ────────────────────────────────────────────────
    if (err.name === 'PrismaClientKnownRequestError') {
        switch (err.code) {
            case 'P2002': // Unique constraint violation (duplicate key)
                return errorResponse(res, 'A record with this value already exists', 409);

            case 'P2025': // Record not found (findUnique/findFirst .where doesn't match)
                return errorResponse(res, 'Record not found', 404);

            case 'P2003': // Foreign key constraint failed
                return errorResponse(res, 'Foreign key constraint failed – invalid reference', 400);

            case 'P2000': // Invalid value (e.g. wrong type, out of range)
                return errorResponse(res, 'Invalid value provided', 400);

            case 'P2016': // Interpretation error / query issue
            case 'P2024': // Connection timeout
                return serverErrorResponse(res, 'Database operation failed – please try again');

            default:
                // Unknown Prisma error – log but don't leak details in production
                break;
        }
    }

    // ────────────────────────────────────────────────
    // 2. MONGOOSE / MONGODB ERRORS
    // ────────────────────────────────────────────────
    if (err.name === 'MongoServerError' || err.code === 11000 || err.codeName === 'DuplicateKey') {
        // E11000 / 11000 = duplicate key error
        return errorResponse(res, 'Duplicate entry – this value already exists', 409);
    }

    if (err.name === 'ValidationError') {
        // Mongoose schema validation failure
        const messages = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
        return errorResponse(res, messages || 'Validation failed', 400);
    }

    if (err.name === 'CastError') {
        // e.g. invalid ObjectId, wrong type conversion
        return errorResponse(res, 'Invalid ID or data format', 400);
    }

    // ────────────────────────────────────────────────
    // 3. NATIVE POSTGRESQL (pg library) ERRORS
    // ────────────────────────────────────────────────
    if (err.code === '23505') {
        // unique_violation
        return errorResponse(res, 'A record with this value already exists', 409);
    }

    if (err.code === '23503') {
        // foreign_key_violation
        return errorResponse(res, 'Foreign key constraint failed – invalid reference', 400);
    }

    if (err.code === '22P02') {
        // invalid_text_representation (e.g. bad UUID, number format)
        return errorResponse(res, 'Invalid data format', 400);
    }

    // ────────────────────────────────────────────────
    // 4. JWT / AUTHENTICATION ERRORS
    // ────────────────────────────────────────────────
    if (err.name === 'JsonWebTokenError') {
        return errorResponse(res, 'Invalid token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 'Token has expired', 401);
    }

    // ────────────────────────────────────────────────
    // 5. GENERAL / FALLBACK HANDLING
    // ────────────────────────────────────────────────
    const statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal server error';

    // Hide detailed error messages in production
    if (statusCode === 500) {
        message = process.env.NODE_ENV === 'production'
            ? 'Something went wrong – please try again later'
            : message;
        return serverErrorResponse(res, message);
    }

    // For expected client errors (400, 401, 403, 404, etc.)
    return errorResponse(res, message, statusCode);
};