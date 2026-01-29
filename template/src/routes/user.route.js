import express from 'express';
const router = express.Router();

import { userController } from "../controllers/user.controller.js";


router.get('/', userController.getUser);
router.post('/', userController.createUser);

export default router;