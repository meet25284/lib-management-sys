import User from "../models/UserSchema.js";
import { emailvalidation, passwordvalidation } from "../validations/validate.js";
import bcrypt from "bcryptjs"
import { createToken } from "./helper.js";
import { LoginValidater, registerValidater } from "../validations/validater.js";

export const RegisterUser = async (req, res) => {
    try {
        const {data,error} = registerValidater.safeParse(req.body)
        if (data) {
           
            const exist = await User.findOne({ email: req.body.email });

            if (exist) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role,
            });
            await User.create(user);
            return res.status(200).json({ message: "User created successfully" });
        
        }
        else if(error){
            res.json({message:error.message})
        }
         else {
            return res.status(400).json({ message: "All fields are required" });
        }
    } catch (err) {
        throw err
    }
}

export const login = async (req, res) => {
    try {
        const {data,error} = LoginValidater.safeParse(req.body)

        if (error) {
            return res.json({message:error.message})}

        else if(data) {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
                if (isPasswordValid) {
                    const token = createToken(user._id);
                    res.status(200).json({ message: "Login successful", token: token });
                }
            } else {
                return res.status(400).json({ message: "User not found" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const profile = async (req, res) => {
    try {

        const user = req?.me;
        if (user?._id) {
            res.status(200).json({
                name: user.name,
                role: user.role
            });
        } else {
            res.status(404).json({ message: "user not found" });

        }
    }
    catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
}