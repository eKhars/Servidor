import Message from '../models/message.model.js';

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.json(messages);
    } catch (error) {
        console.log(error);
    }
};

export const createMessage = async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.json(savedMessage);
    } catch (error) {
        console.log(error);
    }
};
