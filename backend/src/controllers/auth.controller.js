import { sendWelcomeEmail } from "../emails/email-handler.js";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../modals/user.modal.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        
        const user = await User.findOne({email});
        if(user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName, email, password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
           try {
             await  sendWelcomeEmail('akshayshanon@gmail.com', "Akshay Kumar")
           } catch (error) {
             console.error("Failed to send email!")
           }

            res.status(201).json(newUser);
        }else{
            res.status(400).json({message:"Invalid User Data"})
        }

    } catch (error) {
        console.log("Error in user signup: ", error);
        res.status(500).json({ message: error.message })
    }
}

export const login = async(req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        if(!email || !password) return res.status(400).json({message:"Email and Password are required"});
     
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message:"Invalid Credentials"});
    
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials"});
     
        generateToken(user._id, res);
        res.status(200).json({
            name: user.fullName,
            email: user.email
        });

    } catch (error)   {
        console.error("Error in login controller:", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const logout = ( _, res) => {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Logged Out Successfully"});
}

export const updateProfile = async(req, res) =>{
    try {
        const {profilePic} = req.body;
        if(!profilePic) return res.status(400).json({message:"Profile pic is required"})
        
        const userId = req.user._id
        const response = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: response.secure_url}, {new:true});
        res.status(200).json(updatedUser)
    } catch (error) {
        
    }
}