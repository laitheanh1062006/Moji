import express from 'express';
import { getConversations, createConversation, getMessages } from '../controllers/conversationController.js';

import {checkFriendship} from '../middlewares/friendMiddleware.js';

const router = express.Router();

router.post('/', checkFriendship, createConversation);

router.get('/', getConversations);

router.get('/:conversationId/messages', getMessages);

export default router;