const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Chat = require('../models/chat');


router.post('/create-new-chat', [authMiddleware], async (req, res) => {
    try {
        const newChat = new Chat(req.body);

        const savedChat = await newChat.save();

        res.status(201).send({
            message: 'Chat created successfully',
            success: true,
            data: savedChat
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

router.get('/get-all-chats', [authMiddleware], async (req, res) => {
    try {
        const chats = await Chat.find({ members: { $in: [req.body.userId] } }).populate('members', '-password').populate('lastMessage');
        res.status(200).send({
            message: 'Chats fetched successfully',
            success: true,
            data: chats
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
            success: false
        });
    }
});

module.exports = router;