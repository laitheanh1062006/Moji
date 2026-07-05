
export const authMe = (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({user});
    } catch (error) {
        console.error("Error while authenticating Jwt in authMe ", error);
        return res.status(500).json({message:"system error!"});
    }
}