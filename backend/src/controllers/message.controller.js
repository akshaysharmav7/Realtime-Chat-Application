import cloudinary from "../lib/cloudinary.js";
import Message from "../modals/message.model.js";
import User from "../modals/user.modal.js";

//Get all contacts except me
export const getAllContacts = async(req, res) =>{
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select('-password');
        
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getAllContacts", error);
        res.status(500).json({Message: "Server error"})
    }
}

export const getMessageByUserId = async (req, res) =>{
    try {
        const myId = req.user._id;
        const {id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId},
                { senderId: userToChatId, receiverId: myId},
            ],
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getAllContacts", error);
        res.status(500).json({Message: "Server error"})
    }
}

export const sendMessage = async(req, res) =>{
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id; 

        if(!text && !image) {
            return res.status(400).json({message: "Text or image is required"});
        }
        if(senderId.equals(receiverId)){
            return res.status(400).json({message: "Cannot send to yourself "});
        }

        const recieverExists = await User.exists({_id: receiverId});
        if(!recieverExists){
             return res.status(400).json({message: "Receiver not found"});
        }

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        
        await newMessage.save();
        res.status(200).json(newMessage)

    } catch (error) {
        console.log("Error in getAllContacts", error);
        res.status(500).json({Message: "Server error"})
    }
}

export const getChatPartners = async( req, res ) =>{
    try {
        const loggedInUserId = req.user._id;
        //find all the messages where logged in user = sender or reciever
        const messages = await Message.find({
            $or: [{senderId: loggedInUserId }, { receiverId: loggedInUserId}]
        })

        const chatPartnerIds = [ ...new Set(messages.map(msg=> msg.senderId.toString() === loggedInUserId.toString()? msg.receiverId.toString(): msg.senderId.toString()
        ))];
        
        const chatPartners = await User.find({_id: {$in: chatPartnerIds}}).select("-password");
        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in getAllContacts", error);
        res.status(500).json({Message: "Server error"})
    }
}