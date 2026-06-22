import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient, getAuth } from "@clerk/express";
import axios from "axios"
import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
// import pdf from 'pdf-parse/lib/pdf-parse.js'
import * as pdfParse from 'pdf-parse';
const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});


const generateArticle=async(req,res)=>{
    try {
        // plan and free usage come from middleware 
        // that run before controller so attached these 
        // with request then come on controller so that we access it
        const {userId} = getAuth(req);
        const{prompt,length} = req.body;
        const plan = req.plan; 
        const free_usage = req.free_usage;

        // in free plan user have only 10 credits if he use then we show limit reach message
        if(plan !== 'premium' && free_usage >=10 ){
            return res.json({success:false, message:"Limit reached!. Upgrade your plan to continue."});
        }

        const response = await AI.chat.completions.create({
            model: "gemini-3.5-flash",
            messages: [
                {   role: "user",
                    content: prompt 
                },
            ],
            temperature:0.7,
            max_tokens: length
        });
        const content= response.choices[0].message.content;

        await sql `INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage: free_usage + 1
                }
            })
        }

        return res.json({success:true,content})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}


const generateBlogTitle=async(req,res)=>{
    try {
        
        const {userId} = getAuth(req);
        const{prompt} = req.body;
        const plan = req.plan; 
        const free_usage = req.free_usage;

        // in free plan user have only 10 credits if he use then we show limit reach message
        if(plan !== 'premium' && free_usage >=10 ){
            return res.json({success:false, message:"Limit reached!. Upgrade your plan to continue."});
        }

        const response = await AI.chat.completions.create({
            model: "gemini-3.5-flash",
            messages: [
                {   role: "user",
                    content: prompt 
                },
            ],
            temperature:0.7,
            // means max blog title character is 100
            max_tokens: 100
        });
        const content= response.choices[0].message.content;

        await sql `INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage: free_usage + 1
                }
            })
        }

        return res.json({success:true,content})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}

// only premium users use below services 
const generateImage=async(req,res)=>{
    try {
        
        const {userId} = getAuth(req);
        const{prompt,publish} = req.body;
        const plan = req.plan; 

        if(plan !== 'premium'){
            return res.json({success:false, message:"Upgrade your plan, this feature is only available for premium subscriptions "});
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const {data}= await axios.post('https://clipdrop-api.co/text-to-image/v1',formData, {
            headers: {'x-api-key':process.env.CLIPDROP_API_KEY},
            responseType: "arraybuffer",
            })
                // here we get generated image from clipdrop and convert to base64 and pass to cloudinary 
            const base64Image= `data:image/png;base64,${Buffer.from
                (data,'binary').toString('base64')}`;
       
            const { secure_url } = await cloudinary.uploader.upload(base64Image, {
            folder: "CREATA-ai"
            });            

        await sql `INSERT INTO creations (user_id, prompt, content, type, published)
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

        return res.json({success:true, content:secure_url})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}

const removeImageBackground = async(req,res)=>{
    try {
        
        const {userId} = getAuth(req);
        const {image}=req.file;
        const plan = req.plan; 

        if(plan !== 'premium'){
            return res.json({success:false, message:"Upgrade your plan, this feature is only available for premium subscriptions "});
        }

            const { secure_url } = await cloudinary.uploader.upload(image.path, 
                {
                folder: "CREATA-ai",
                transformation:[
                    {
                        effect: 'background_removal',
                        background_removal:'remove_the_background'
                    }
                ]
            });            

        await sql `INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId},"Remove background from image", ${secure_url}, 'image')`;

        return res.json({success:true, content:secure_url})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}

const removeImageObject = async(req,res)=>{
    try {
        
        const {userId} = getAuth(req);
        const {object} = req.body;
        const {image}=req.file;
        const plan = req.plan; 

        if(plan !== 'premium'){
            return res.json({success:false, message:"Upgrade your plan, this feature is only available for premium subscriptions "});
        }

            const { public_id } = await cloudinary.uploader.upload(image.path,{                
                folder: "CREATA-ai",
            })

            const imageUrl= cloudinary.url(public_id,{
                transformation: [{effect:`gen_remove:${object}`}],
                resource_type:'image'
            })

        await sql `INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId},${`Removed ${object} from image`}, ${imageUrl}, 'image')`;

        res.json({success:true, content:imageUrl})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}

const resumeReview = async(req,res)=>{
    try {
        
        const {userId} = getAuth(req);
        const resume=req.file;
        const plan = req.plan; 

        if(plan !== 'premium'){
            return res.json({success:false, message:"Upgrade your plan, this feature is only available for premium subscriptions "});
        }
            // check resume size not greater then 5MB
        if(resume.size > 5 * 1024 * 1024){
            return res.json({success:false,message:"Resume file size exceeds allowed size (5MB)."})

        }
            // here we parse resume to extract their tex using file system(fs)
            // This line reads the contents of the file at resume.path and stores it as raw binary data (Buffer) in the dataBuffer variable.
        const dataBuffer = fs.readFileSync(resume.path)
        const pdfData= await pdfParse.default(dataBuffer)

        const prompt=`Review the following resume and provide contructive 
        feedback on its strengths, weaknesses, and area for improvement. Resume
        Content:\n\n${pdfData.text}`

        const response = await AI.chat.completions.create({
            model: "gemini-3.5-flash",
            messages: [
                {   role: "user",
                    content: prompt 
                },
            ],
            temperature:0.7,
            max_tokens: 1000,
        });
        const content= response.choices[0].message.content;

        await sql `INSERT INTO creations (user_id, prompt, content, type)
        VALUES (${userId},'Review the uploaded resume', ${content}, 'resume-review')`;

        return res.json({success:true,content})

    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}


export{generateArticle, generateBlogTitle,generateImage,removeImageBackground,removeImageObject,resumeReview}