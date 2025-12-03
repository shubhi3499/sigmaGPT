import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";
const router = express.Router();

router.post("/test",async(req,res)=>{
    try
    {
        const thread = new Thread({
            threadId:"xyz",
            title:"Testing new thread"
        });

        const response = await thread.save();
        res.send(response);
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Failed to save in Database"});
    }
})

//get all threads
router.get("/thread",async(req,res)=>{
    try
    {
       const threads =  await Thread.find({}).sort({updatedAt:-1});
       res.json(threads);
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Failed to fetched threads"});
    }
});

router.get("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try
    {
        const thread = await Thread.findOne({threadId});
        if(!thread)
        {
            res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.messages);
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:"Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try
    {
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread)
        {
            res.status(404).json({error:"Thread not found"});
        }
        res.status(200).json({success:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete thread"});
    }
});

router.post("/chat",async(req,res)=>{
    const {threadId,messages} = req.body;
    if(!threadId||!messages)
    {
        res.status(400).json({error:"missing required fields"});
    }
    try
    {
        const thread = await Thread.findOne({threadId});
        if(!thread)
        {
            //create a new thread in DB
            thread = new Thread({
                threadId,
                title:messages,
                messages:[{role:"user",content:messages}]
            });
        }else{
            thread.messages.push({role:"user",content:messages});
        }
        const assistantreply = await getOpenAIAPIResponse(messages);
        thread.messages.push({role:"assistant",content:assistantreply});
        thread.updatedAt = new Date();
        await thread.save();
        res.json({reply:assistantreply});
    }catch(err)
    {
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
})

export default router;