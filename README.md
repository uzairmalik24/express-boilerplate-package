# Create Uzair Backend

A production-ready Express.js backend boilerplate with MongoDB integration, built-in middleware, and best practices out of the box.

## 🚀 Quick Start

Create a new backend project instantly:
```bash
npx create-uzair-backend <backend-name>
```

Example:
```bash
npx create-uzair-backend my-awesome-api
cd my-awesome-api
npm install
npm start
```

## 📦 What's Included

### Pre-configured Structure
```
src/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Request handlers
├── middlewares/     # Express middlewares
│   ├── errorHandler.middleware.js
│   └── rateLimiter.middleware.js
├── model/           # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
│   ├── password.service.js
│   └── response.service.js
└── utils/           # Utility functions
    └── asyncHandler.js
```

### Built-in Features

✅ **Express.js v5** - Fast, unopinionated web framework  
✅ **CORS** - Pre-configured cross-origin resource sharing  
✅ **MongoDB & Mongoose** - Database integration ready  
✅ **Async Handler** - Automatic try-catch wrapping  
✅ **Rate Limiter** - Request rate limiting with `express-rate-limit`  
✅ **Password Hashing** - Secure bcrypt implementation with `bcryptjs`  
✅ **Response Service** - Standardized API responses  
✅ **Error Handler** - Centralized error handling  
✅ **Environment Variables** - Configuration with `dotenv`  
✅ **Hot Reload** - Development server with `nodemon`  

## 📋 Dependencies

This boilerplate comes with the following production-ready packages:
```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",           // Password hashing
    "cors": "^2.8.6",               // CORS middleware
    "dotenv": "^17.2.3",            // Environment variables
    "express": "^5.2.1",            // Web framework
    "express-rate-limit": "^8.2.1", // Rate limiting
    "mongoose": "^9.1.5",           // MongoDB ODM
    "nodemon": "^3.1.11"            // Development auto-restart
  }
}
```

## 🎯 Usage

### Controller Pattern

Controllers use the `asyncHandler` wrapper to eliminate manual try-catch blocks:
```javascript
import { asyncHandler } from '../utils/asyncHandler.js';
import { errorResponse, successResponse } from '../services/response.service.js';
import { hashPassword } from '../services/password.service.js';

export const userController = {
    getUser: asyncHandler(async (req, res) => {
        return successResponse(res, 'User fetched successfully', {
            name: 'John Doe'
        });
    }),

    createUser: asyncHandler(async (req, res) => {
        const { name, password = '123456' } = req.body;
        if (!name || !password) {
            return errorResponse(res, 'Name and password are required');
        }

        const hashedPassword = await hashPassword(password);
        return successResponse(res, 'User created successfully', {
            name: name,
            password: hashedPassword
        });
    }),
};
```

### Async Handler

No more repetitive try-catch blocks:
```javascript
// ❌ Without asyncHandler
export const getUser = async (req, res) => {
    try {
        // your logic
    } catch (error) {
        // error handling
    }
};

// ✅ With asyncHandler
export const getUser = asyncHandler(async (req, res) => {
    // your logic - errors automatically caught!
});
```

### Response Service

Standardized success and error responses:
```javascript
// Success response
successResponse(res, 'Operation successful', { data: 'your data' });

// Error response
errorResponse(res, 'Something went wrong', 400);
```

### Password Service

Secure password hashing with bcryptjs:
```javascript
import { hashPassword, comparePassword } from '../services/password.service.js';

// Hash a password
const hashedPassword = await hashPassword('myPassword123');

// Compare passwords
const isMatch = await comparePassword('myPassword123', hashedPassword);
```

## 🔧 Customization

### Using a Different Database/ORM

If you prefer using PostgreSQL, MySQL, or another database:

1. Remove MongoDB connection:
```bash
   # Delete MongoDB config file
   rm src/config/database.js
   
   # Uninstall Mongoose
   npm uninstall mongoose
```

2. Install your preferred database library:
```bash
   # PostgreSQL with Sequelize
   npm install pg sequelize
   
   # PostgreSQL with Prisma
   npm install @prisma/client
   npx prisma init
   
   # MySQL
   npm install mysql2 sequelize
```

3. Update configuration in `src/config/`

### Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your-database
NODE_ENV=development
JWT_SECRET=your-secret-key
```

## 🛡️ Middleware

### Rate Limiter

Protect your API from abuse with built-in rate limiting using `express-rate-limit`:
```javascript
import { rateLimiter } from '../middlewares/rateLimiter.middleware.js';

// Apply to specific routes
router.post('/login', rateLimiter, userController.login);

// Or apply globally
app.use('/api/', rateLimiter);
```

### Error Handler

Centralized error handling middleware automatically catches and formats errors:
```javascript
import { errorHandler } from '../middlewares/errorHandler.middleware.js';

// Applied in app.js
app.use(errorHandler);
```

## 📝 Example Routes
```javascript
import express from 'express';
import { userController } from '../controllers/user.controller.js';
import { rateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.get('/user', userController.getUser);
router.post('/user', rateLimiter, userController.createUser);

export default router;
```

## 🚀 Development
```bash
# Install dependencies
npm install

# Start development server with nodemon
npm run dev

# Start production server
npm start
```

### Package Scripts

Add these to your `package.json`:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

## 🏗️ Project Structure
```
my-backend/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   └── user.controller.js  # Request handlers
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js
│   │   └── rateLimiter.middleware.js
│   ├── model/
│   │   └── user.model.js       # Mongoose schemas
│   ├── routes/
│   │   ├── index.js            # Main router
│   │   └── user.route.js       # User routes
│   ├── services/
│   │   ├── password.service.js # Bcrypt utilities
│   │   └── response.service.js # Response helpers
│   ├── utils/
│   │   └── asyncHandler.js     # Async wrapper
│   ├── app.js                  # Express app setup
│   └── index.js                # Entry point
├── .env                        # Environment variables
├── .gitignore
└── package.json
```

## 🌟 Features in Detail

### ES Modules Support
Uses `"type": "module"` for modern JavaScript import/export syntax.

### CORS Pre-configured
Cross-origin requests are handled out of the box.

### Password Security
Uses `bcryptjs` for secure password hashing with salt rounds.

### Standardized Responses
Consistent API response format across all endpoints.

### Error Handling
Automatic error catching and formatting with custom error handler.

### Rate Limiting
Protects your API from brute-force attacks and abuse.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📄 License

MIT

## 👤 Author

**Uzair**

---

**Happy Coding! 🚀**
