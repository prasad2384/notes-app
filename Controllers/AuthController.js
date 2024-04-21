import { comparePassword, hashPassword } from '../Helper/AuthHelper.js';
import usermodel from '../Models/Person.js';
import JWT from 'jsonwebtoken';
import mongoose from 'mongoose';
import fs from 'fs';

export const registerController = async (req, res) => {
    try {
        const { first_name, last_name, email, password, mobile_number, confirm_password } = req.body;

        if (!first_name || !last_name || !email || !password || !mobile_number || !confirm_password) {
            return res.send({
                success: false,
                message: 'All fields are required.',
            });
        }

        const nameRegex = /^[A-Za-z]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const indianMobileNumberRegex = /^(?:\+?91)?[789]\d{9}$/;
        if (!nameRegex.test(first_name)) {
            return res.send({
                success: false,
                message: 'First name must contain only alphabets and no spaces.',
            });
        }

        if (!nameRegex.test(last_name)) {
            return res.send({
                success: false,
                message: 'Last name must contain only alphabets and no spaces.',
            });
        }

        if (!emailRegex.test(email)) {
            return res.send({
                success: false,
                message: 'Invalid email format.',
            });
        }

        if (!indianMobileNumberRegex.test(mobile_number)) {
            return res.send({
                success: false,
                message: 'Invalid mobile number format.',
            });
        }

        if (password != confirm_password) {
            return res.send({
                success: false,
                message: 'Password and Confirm Password Not Match',
            });
        }

        const emailcheck = await usermodel.findOne({ email });
        if (emailcheck) {
            return res.send({
                success: false,
                message: 'Already Register please login',
            });
        }

        const hashedPassword = await hashPassword(password);
        const defaultImagePath = 'https://icon-library.com/images/business-man-icon/business-man-icon-1.jpg';
        const user = await new usermodel({ first_name, last_name, email, mobile_number, password: hashedPassword, photo: defaultImagePath }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration',
            error
        })
    }

}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password) {
            res.send({
                success: false,
                message: 'All Fields are required'
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.send({
                success: false,
                message: 'Invalid email format.',
            });
        }

        if (!password) {
            return res.send({
                success: false,
                message: 'Password is Required'
            });
        }
        const emailcheck = await usermodel.findOne({ email });

        if (!emailcheck) {
            return res.send({
                success: false,
                message: 'Email Not Registered'
            })
        }
        const match = await comparePassword(password, emailcheck.password);
        if (!match) {
            return res.send({
                success: false,
                message: 'Invalid Password'
            });
        }

        const token = await JWT.sign({ _id: emailcheck._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.send({
            success: true,
            message: 'Login Success',
            user: {
                first_name: emailcheck.first_name,
                last_name: emailcheck.last_name,
                email: emailcheck.email,
                id: emailcheck._id,
                photo: emailcheck.photo,
            },
            token: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login'
        });
    }
}

export const fetchuserController = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send({
                success: false,
                message: 'Invalid id format'
            });
        }
        const usercheck = await usermodel.findById(id).select("-photo");
        if (!usercheck) {
            return res.send({
                success: false,
                message: 'User Not Found',
            });
        }
        return res.status(200).send({
            success: true,
            user: usercheck
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in User Fetch',
            error
        })
    }
}

export const updateuserController = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, mobile_number, state, country, city, address, date_of_birth, pincode } = req.body;
    try {
        const nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(first_name)) {
            return res.send({
                success: false,
                message: 'First name must contain only alphabets and no spaces.',
            });
        }

        if (!nameRegex.test(last_name)) {
            return res.send({
                success: false,
                message: 'Last name must contain only alphabets and no spaces.',
            });
        }

        // if (!indianMobileNumberRegex.test(mobile_number)) {
        //     return res.send({
        //         success: false,
        //         message: 'Invalid mobile number format.',
        //     });
        // }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send({
                success: false,
                message: 'Invalid id format'
            });
        }
        const usercheck = await usermodel.findById(id);
        if (!usercheck) {
            return res.send({
                success: false,
                message: 'User Not Found',
            });
        }
        console.log("data",first_name,last_name,mobile_number,pincode);
        const update_user = await usermodel.findByIdAndUpdate(id, { first_name: first_name, last_name: last_name, mobile_number: mobile_number, pincode: pincode, country: country, state: state, city: city, address: address, date_of_birth: date_of_birth },{upsert:true});
        await update_user.save();
        console.log(update_user);
        return res.status(200).send({
            success: true,
            message: 'Profile Update Successfully',
            update_user,
        });
    } catch (error) {
        console.log(error);
        return res.status().send({
            success: false,
            message: 'Error in Update User',
            error
        });
    }
}

export const uploadimageController = async (req, res) => {
    const { id } = req.params;
    const { photo } = req.files;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send({
                success: false,
                message: 'Invalid id format'
            });
        }

        const usercheck = await usermodel.findById(id);

        if (!usercheck) {
            return res.send({
                success: false,
                message: 'User Not Found',
            });
        }
        if (photo) {
            // If a new photo is uploaded, update the photo field
            usercheck.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            };
        }
        // Save the updated user data
        await usercheck.save();
        res.status(200).send({
            success: true,
            message: 'Profile Image Upload Successfully',
            usercheck
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Upload Image',
            error
        });
    }
}

export const userPhotoController = async (req, res) => {
    try {
        const user = await usermodel.findById(req.params.id).select("photo");
        if (user.photo.data) {
            res.set("Content-Type", "image/*");
            return res.status(200).send(user.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
}