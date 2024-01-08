"use server"

import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

//Create a thread
export async function createThread({text, author, communityId, path,}: Params) {

    try {
        //Connect to database
        connectToDB();

        //Create a thread in the database using the model
        const createdThread = await Thread.create({
            text,
            author,
            community: null, //Will be the community of the person who created the thread, else null
        });

        //Update user to associate this thread with him by adding this thread into the array of threads
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${ error.message }`)

    }
}


//Fetch all posts
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    try {
        //Connect to database
        connectToDB();

        //Calculate the number of posts to skip depending on which page we are on
        const skipAmount = (pageNumber - 1) * pageSize;

        //Find posts that have no parents (top-level threads) as we do not want
        //to fetch posts that are comments. Show latest threads at the top.
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
                                 .sort({ createdAt: 'desc'})
                                 .skip(skipAmount)
                                 .limit(pageSize)
                                 .populate({path: 'author', model: User})
                                 .populate({ path: 'children', populate: {
                                    path: 'author',
                                    model: User,
                                    select: '_id name parentId image'
                                 }});
        
        //Only want to count top level post
        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined ]}});
        
        //Execute the query
        const posts = await postsQuery.exec();

        //Check whether there are more posts that come after this page
        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext };

        
    } catch (error : any) {
        console.log(`Cannot fetch posts: ${error.message}`);
    }
}


