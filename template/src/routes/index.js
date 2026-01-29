import express from 'express';
const router = express.Router();
import routes from './user.route.js';

router.use('/user', routes);

export default router;