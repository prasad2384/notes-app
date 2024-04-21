import Express from "express";
import { loginController, registerController, fetchuserController, updateuserController, uploadimageController, userPhotoController } from "../Controllers/AuthController.js";
import formidableMiddleware from 'express-formidable';

const router = Express.Router();

router.post('/register', registerController);

router.post('/login',loginController);

router.get('/fetch-profile/:id',fetchuserController);

router.put('/update-profile/:id',updateuserController);

router.post('/upload-image/:id',formidableMiddleware(),uploadimageController);

router.get('/user-photo/:id',userPhotoController);

export default router;