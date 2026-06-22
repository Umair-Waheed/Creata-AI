// Middleware to check userId and Premium plan

import { clerkClient, getAuth } from "@clerk/express";

export const auth =async(req,res,next)=>{
    try {
        const {userId,has} = await getAuth(req);
        console.log(userId);
        const hasPremiumPlan = await has({plan:'premium'});
         if (!userId) {
            return res.json({ success:false,message:'Unauthorized. Please log in.' });
        }

        const user = await clerkClient.users.getUser(userId);
        // get free usage limit for checking in controller if they generate or not more things 
        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        } else{
            // if user have premium plan then free usage set to 0 bcz they have premium limits and send with req
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();

        
    } catch (error) {
        res.json({success:false,message:error.message})
    } 
}