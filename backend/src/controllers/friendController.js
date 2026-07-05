import FriendRequest from '../models/FriendRequest.js';
import Friend from '../models/Friend.js';
import User from '../models/User.js';

export const sendFriendRequest = async (req,res) =>{
    try {
        const {to, message} = req.body;

        const from = req.user._id;

        if (from === to){
            return res
            .status(400)
            .json({message:"you cannot send a friend request to yourself!"});
        }

        const userExists = await User.exists({_id: to});

        if (!userExists){
            return res
            .status(404)
            .json({message:"user not found!"});
        }

        let userA = from.toString();
        let userB = to.toString();

        if (userA > userB){
            [userA, userB] = [userB, userA];
        }

        const [alreadyFriends, existingRequest] = await Promise.all([
            Friend.findOne({userA, userB}),
            FriendRequest.findOne({from: from, to: to})
        ]);

        if (alreadyFriends){
            return res
            .status(400)
            .json({message:"you are already friends with this user!"});
        }

        if (existingRequest){
            return res
            .status(400)
            .json({message:"you have already sent a friend request to this user!"});
        }

        const request = await FriendRequest.create({from, to, message});

        return res.status(201).json({message:"friend request sent successfully!", request});


    } catch (error) {
        console.error("Error while sending friend request!", error);
        return res.status(500).json({message:"system error!"});
    }
};

export const acceptFriendRequest = async (req,res) =>{
    try {
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request){
            return res
            .status(404)
            .json({message:"friend request not found!"});
        }

        if (request.to.toString() !== userId.toString()){
            return res
            .status(403)
            .json({message:"you are not authorized to accept this friend request!"});
        }

        const friend = await Friend.create({userA: request.from, userB: request.to});

        await FriendRequest.findByIdAndDelete(requestId);

        const from = await User.findById(request.from).select('_id displayName avatarUrl').lean();

        return res.status(200).json(
            {
                message:"friend request accepted successfully!",
                newFriend: {
                    _id: from?._id,
                    displayName: from?.displayName,
                    avatarUrl: from?.avatarUrl,
                },
            }
        );
    } catch (error) {
        console.error("Error while accepting friend request!", error);
        return res.status(500).json({message:"system error!"});
    }
};  

export const declineFriendRequest = async (req,res) =>{
    try {
        
        const {requestId} = req.params;
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request){
            return res
            .status(404)
            .json({message:"friend request not found!"});
        }

        if (request.to.toString() !== userId.toString()){
            return res
            .status(403)
            .json({message:"you are not authorized to decline this friend request!"});
        }

        await FriendRequest.findByIdAndDelete(requestId);

        return res.status(200).json({message:"friend request declined successfully!"});

    } catch (error) {
        console.error("Error while declining friend request!", error);
        return res.status(500).json({message:"system error!"});
    }
};  


export const getAllFriends = async (req,res) =>{
    try {
        
        const userId = req.user._id;

        const friendships = await Friend.find(
            {
                $or:[
                    {
                        userA: userId,
                    },
                    {
                        userB: userId,
                    },
                ],
            }
        )
        .populate("userA", "_id displayName avatarUrl")
        .populate("userB", "_id displayName avatarUrl")
        .lean();

        if(!friendships.length){
            return res.status(200).json({message:"no friends found!", friends: []});
        }

        const friends = friendships.map((f) => f.userA._id.toString() === userId.toString() ? f.userB : f.userA);

        return res.status(200).json({friends});


    } catch (error) {
        console.error("Error while getting all friends!", error);
        return res.status(500).json({message:"system error!"});
    }
};  

export const getFriendRequests = async (req,res) =>{
    try {

        const userId = req.user._id;

        const populateFields = "_id username displayName avatarUrl";

        const [sent, received] = await Promise.all([
            FriendRequest.find({from: userId}).populate("to", populateFields),
            FriendRequest.find({to: userId}).populate("from", populateFields),
        ]);

        res.status(200).json({ sent, received });

    } catch (error) {
        console.error("Error while getting friend requests!", error);
        return res.status(500).json({message:"system error!"});
    }
};  