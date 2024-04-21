import notesmodel from "../Models/Note.js";
import usermodel from '../Models/Person.js';
import mongoose from "mongoose";
export const CreateNotesController = async (req, res) => {
    try {
        const { title, category, content, user_id } = req.body;
        if (!title || !category || !content || !user_id) {
            return res.send({
                success: false,
                message: 'All fields are required.'
            });
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid user_id format.'
            });
        }

        const usercheck = await usermodel.findById(user_id);

        if (!usercheck) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found',
            });
        }
        const notescreate = await notesmodel.create({ title, category, content, user_id });
        return res.status(201).send({
            success: true,
            message: 'Notes Created Successfully',
            notescreate,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Create Notes',
            error
        });
    }
}

export const FetchNotesController = async (req, res) => {
    const { user_id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send({
                success: false,
                message: 'Invalid user_id format.'
            });
        }

        const usercheck = await usermodel.findById(user_id);

        if (!usercheck) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found',
            });
        }

        const fetchnotes = await notesmodel.find({ user_id: usercheck._id });
        if (!fetchnotes) {
            return res.status(404).send({
                success: true,
                message: 'Notes Are Not Found'
            });
        }
        return res.status(200).send({
            success: true,
            fetchnotes
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Fetch Notes',
            error
        });
    }
}

export const DeleteNotesController = async (req, res) => {
    const { id } = req.params;
    try {
        const notes = await notesmodel.findByIdAndDelete({ _id: id });
        if (!notes) {
            res.send({
                success: false,
                message: 'ID Not Found In Notes Table'
            });
        }
        res.status(200).send({
            success: true,
            message: 'Notes Deleted Successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Delete Notes',
            error
        });
    }
}

export const FetchSingleNotes = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.send({
                success: false,
                message: 'Id Not Match'
            });
        }
        const notes = await notesmodel.findById({ _id: id });
        if (!notes) {
            res.send({
                success: false,
                message: 'ID Not Match',
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Notes Fetch by Id',
            notes
        });
    } catch (error) {
        console.log(error);

    }
}

export const UpdateNotesController = async (req, res) => {

    const { id } = req.params;
    const { title, category, content, user_id } = req.body;
    if (!title || !category || !content || !user_id) {
        return res.send({
            success: false,
            message: 'All fields are required.'
        });
    }
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
        return res.send({
            success: false,
            message: 'Invalid user_id format.'
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.send({
            success: false,
            message: 'Invalid Notes Id format.'
        });
    }

    const usercheck = await usermodel.findById(user_id);

    if (!usercheck) {
        return res.status(404).send({
            success: false,
            message: 'User Not Found',
        });
    }

    const notes = await notesmodel.findByIdAndUpdate(id,{title:title,category:category,content:content,user_id:user_id},{new:true});

    await notes.save();
    res.status(200).send({
        success: true,
        message: "Notes Updated Successfully",
        notes
    });

}