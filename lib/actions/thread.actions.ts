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



