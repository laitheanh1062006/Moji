import Conversation from "../models/Conversation.js";

import Friend from "../models/Friend.js";


//swap user a b to correct order
const pair = (a, b) => (a<b?[a,b]:[b,a]);

export const checkFriendship = async (req, res, next) => {
    try {
        
        const me = req.user._id.toString();

        const recipientId = req.body?.recipientId ?? null;

        const memberIds = req.body?.memberIds ?? [];

        if (!recipientId && !memberIds.length === 0){
            return res.status(400).json({message:"recipientId or memberIds is required!"});
        }

        if (recipientId){
            const [userA, userB] = pair(me, recipientId);

            const isFriend = await Friend.findOne({userA, userB});

            if(!isFriend){
                return res.status(403).json({message:"you are not friends!"});
            }

            return next();
        }

        //Group chat
        const friendChecks = memberIds.map(
            async (memberId) => {
                const [userA, userB] = pair(me, memberId);
                const friend = await friend.findOne({userA, userB});
                return friend ? null : memberId;
            }
        )

        const result = await Promise.all(friendChecks);

        const notFriends = result.filter(Boolean);

        if (notFriends.length > 0){
            return res.status(403).json({message:"You can only add friends to the group chat!"});
        }

        next();
    } catch (error) {
        console.error("Error while checking friendship in friendMiddleware ", error);
        return res.status(500).json({message:"system error!"});
    }
}

export const checkGroupMembership = async (req, res, next) => {
    try {
        const {conversationId} = req.body;
        const userId = req.user._id;

        const conversation = await Conversation.findById(conversationId);


        if(!conversation){
            return res.status(404).json({message:"Conversation not found!"});
        }

        const isMember = conversation.participants.some((p)=>
            p.userId.toString() === userId.toString()
        );

        if(!isMember){
            return res.status(403).json({message:"You are not a member of this group!"});
        }

        req.conversation = conversation;

        next();


    } catch (error) {
        console.error("Error while checking group membership in friendMiddleware ", error);
        return res.status(500).json({message:"system error!"});
    }
}