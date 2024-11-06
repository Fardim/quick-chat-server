const router = require('express').Router();
const Message = require('../models/message');
const Chat = require('../models/chat');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/new-message', [authMiddleware], async (req, res) => {
    try {
        // Store the message in the collection
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();

        // Update the chat collection with the last message
        await Chat.findByIdAndUpdate(
            {
                _id: req.body.chatId
            },
            {
                lastMessage: savedMessage._id,
                $inc: { unreadMessageCount: 1 }
            }
        );

        res.status(201).send({
            message: 'Message sent successfully',
            success: true,
            data: savedMessage
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

router.get('/get-all-messages/:chatId', [authMiddleware], async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
        res.status(200).send({ message: 'Messages fetched successfully', success: true, data: messages });
    } catch (error) {
        res.status(400).send({ message: error.message, success: false });
    }
}); 

module.exports = router;
