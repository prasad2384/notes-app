import usermodel from '../Models/Person.js';
import otpmodel from '../Models/Otp.js';
import { sendMail } from '../Helper/Mailer.js';
import otpgenrator from 'otp-generation';
import { oneMinuteExpiry } from '../Helper/OtpValidator.js';
import JWT from 'jsonwebtoken';
const genrateRandom4Digitotp = () => {
    return Math.floor(1000 + Math.random() * 9000);
}
export const SendOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                success: true,
                message: 'Email is Required',
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.send({
                success: false,
                message: 'Invalid Email Format'
            });
        }
        const emailcheck = await usermodel.findOne({ email });
        if (!emailcheck) {
            return res.send({
                success: false,
                message: 'Email Not Registered'
            });
        }

        const g_otp = await genrateRandom4Digitotp();

        //check the otp if already exit with the time 
        const old_OtpData = await otpmodel.findOne({ user_id: emailcheck._id });
        if (old_OtpData) {
            const SendNextOtp = await oneMinuteExpiry(old_OtpData.timestamp);
            if (!SendNextOtp) {
                return res.send({
                    success: false,
                    message: 'Pls try after some time!'
                });
            }
        }
        const cDate = new Date();
        const otp = await otpmodel.findOneAndUpdate({ user_id: emailcheck._id }, { Otp: g_otp, timestamp: new Date(cDate.getTime()) }, { upsert: true, new: true, setDefaultsOnInsert: true });
        // const  c_otp= await new otpmodel({ user_id: emailcheck._id, Otp: g_otp }).save();
        const msg = [
            {
                first_name: emailcheck.first_name,
                last_name: emailcheck.last_name,
                otp: g_otp,
            }
        ]
        await sendMail(emailcheck.email, 'Otp For Login', msg);
        return res.send({
            success: true,
            message: 'OTP is Send to Your Mail',
            otp
        });
    } catch (error) {
        console.log(error);
    }
}

export const CheckOtpController = async (req, res) => {
    const { otp } = req.body;
    console.log(otp);
    if (!otp) {
        return res.send({
            success: false,
            message: 'Enter Otp'
        });
    }
    const otpcheck = await otpmodel.findOne({ Otp: otp });
    if (!otpcheck) {
        return res.send({
            success: false,
            message: 'Otp is Not Valid'
        });
    } else {
        const SendNextotp = await oneMinuteExpiry(otpcheck.timestamp);
        console.log(SendNextotp);
        if (SendNextotp) {
            return res.send({
                success: false,
                message: 'Otp is Expired',
            });
        }
        const user= await usermodel.findById(otpcheck.user_id);
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).send({
            success: true,
            message: 'Otp is Valid',
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                id: user._id,
                photo:user.photo,
            },
            token: token
        });
    }

}