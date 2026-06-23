import { getAuth } from "@clerk/express";
import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
    try{
        const {userId}=getAuth(req);

        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId}
        ORDER BY created_at DESC`;

        return res.json({success:true,creations});
        
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}

export const getPublishedCreaitons = async (req, res) => {
    try{

        const creations = await sql`SELECT * FROM creations WHERE published = true
        ORDER BY created_at DESC`;

        return res.json({success:true,creations});
        
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}

export const toggleLikeCreations = async (req, res) => {
    try{
        const {userId}=getAuth(req);
        const {id} = req.body; //get creation id from frontend
        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

        if(!creation){
            return res.json({success:false,message:"creation not found"});
        }

        const currentLikes = creation.likes;
        const userIdstr = userId.toString();
        let updatedLikes;
        let message;

        //  if user unlike the creations
        if(currentLikes.includes(userIdstr)){
            updatedLikes = currentLikes.filter((user)=> user !== userIdstr);
            message = "Creation disliked"
        }else{
            updatedLikes= [...currentLikes, userIdstr]
            message = "Creation Liked"

        }
        // here sperate the element of array bcz new like added
        const formattedArray=`{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

        return res.json({success:true, message});
        
    }catch(error){
        return res.json({success:false, message:error.message})
    }
}