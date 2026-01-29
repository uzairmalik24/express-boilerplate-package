import { asyncHandler } from '../utils/asyncHandler.js'; // try catch wrapper, you'll not need to write try catch blocks in your controllers
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
        return successResponse(res, 'User got successfully', {
            name: name,
            password: hashedPassword
        });
    }),

}