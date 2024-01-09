"use server"

import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model";

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

        //Try to find community
        const communityIdObject = await Community.findOne(
            { id: communityId},
            { _id: 1}
        );

        //Create a thread in the database using the model
        const createdThread = await Thread.create({
            text,
            author,
            community: communityIdObject, //Will be the community of the person who created the thread, else null
        });

        //Update user to associate this thread with him by adding this thread into the array of threads
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })


        if (communityIdObject) {
            //Update Community model with new thread
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: { threads: createdThread._id },
            });
        }

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${ error.message }`);

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
        const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({
        path: "author",
        model: User,
        })
        .populate({
        path: "community",
        model: Community,
        })
        .populate({
        path: "children", // Populate the children field
        populate: {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id name parentId image", // Select only _id and username fields of the author
        },
        });
        
        //Only want to count top level post
        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined ]}});
        
        //Execute the query
        const posts = await postsQuery.exec();

        //Check whether there are more posts that come after this page
        const isNext = totalPostsCount > skipAmount + posts.length;

        return { posts, isNext };


    } catch (error : any) {
        throw new Error(`Error fetching posts: ${error.message}`);
    }
}

//Fetch a given thread by id
export async function fetchThreadById(id: string) {
    try {
        const thread = await Thread.findById(id)
          .populate({
            path: "author",
            model: User,
            select: "_id id name image",
          }) // Populate the author field with _id and username
          .populate({
            path: "community",
            model: Community,
            select: "_id id name image",
          }) // Populate the community field with _id and name
          .populate({
            path: "children", // Populate the children field
            populate: [
              {
                path: "author", // Populate the author field within children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
              {
                path: "children", // Populate the children field within children
                model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
                populate: {
                  path: "author", // Populate the author field within nested children
                  model: User,
                  select: "_id id name parentId image", // Select only _id and username fields of the author
                },
              },
            ],
          })
          .exec();
        return thread;
    } catch (error: any) {
        throw new Error(`Error fetching thread: ${ error.message }`)
    }

}

//Add a comment
export async function addCommentToThread(threadId:string, commentText: string, userId: string, path: string) {
    try {
        connectToDB();

        //Find the original thread by its id
        const originalThread = await Thread.findById(threadId);
        if (! originalThread) {
            throw new Error("Original thread not found");
        }

        //Create a new thread with the comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        });

        //Save the new thread to the database
        const savedCommentThread = await commentThread.save();

        //Update the original thread to include the new comment in its children threads
        originalThread.children.push(savedCommentThread._id);

        //Save the original thread
        await originalThread.save();

        revalidatePath(path);

    } catch (error: any) {
        console.error(`Error adding comment to thread: ${error.message}`);
        throw new Error(`Error adding comment to thread: ${error.message}`);
    }
}


