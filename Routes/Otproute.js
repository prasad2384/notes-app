import Express from 'express';
import { SendOtpController, CheckOtpController } from '../Controllers/OtpController.js';

const router= Express.Router();

router.post('/send-otp',SendOtpController);

router.post('/check-otp',CheckOtpController);

export default router;