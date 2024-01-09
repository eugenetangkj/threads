"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

//Actions on server-side regarding the user collection

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}


//Updates a user document
export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
    }: Params): Promise<void> {
    //Connect to database
    connectToDB();

    try {
        //Make calls to database
        await User.findOneAndUpdate(
            { id: userId }, //Find the user document with the id

            //Update that user
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },

            //Upsert is a combination of update and insert. It is a database operation
            //that will update an existing row if a specified value exists in the table,
            //else insert a new row if the specified value does not already exist.
            { upsert: true }
        );


        if (path === '/profile/edit') {
            //Editing a profile
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Cannot create/update user: ${error.message}`);
    }

}

//Fetch a user document
export async function fetchUser(userId: string) {
    try {
        //Connect to database
        connectToDB();

        //Fetch user document using User model
        return await User
            .findOne({ id: userId })
            // .populate({
            //     path: 'communities',
            //     model: Community
            
            // });
    } catch (error: any) {
        throw new Error(`Cannot fetch user: ${ error.message }`);
    }
}

//Fetch threads belonging to a given user
export async function fetchUserPosts(userId: string) {
    try {
        connectToDB();

        //Fetch threads belonging to the user with an given userid
        const threads = await User.findOne({ id: userId }).populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User, //Needed as child threads may not be authored by the current user
                    select: 'name image id'
                }
            }
        }
        );

        return threads;

       

    } catch (error: any) {
        throw new Error(`Cannot fetch posts: ${ error.message }`);
    }
}

//Fetch all users
export async function fetchUsers({
    userId,
    searchString= "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"

}: {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i"); //i means search is case-insensitive

        //Create query
        const query : FilterQuery<typeof User> = {
            id: { $ne : userId }, //Filter out our own account so we do not appear in the search list
        }

        //Check if user has some search term to filter the users
        if (searchString.trim() !== '') {
            //Search the regex for a match in either the username or the name
            query.$or = [
                { username: { $regex: regex }},
                { name: { $regex: regex }},
            ]
        }

        //Sort the query results and get the relevant entries
        const sortOptions = { createdAt: sortBy }
        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);


        //Counts the number of total users found in the given query
        const totalUsersCount = await User.countDocuments(query);

        const users = await usersQuery.exec();

        //Determine if there is a next page
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext }

    
    } catch (error: any) {
        throw new Error(`Cannot fetch users: ${ error.message }`);
    }
}

//Get activity for a particular user
export async function getActivity(userId: string) {
    try {
        connectToDB();

        //Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });

        //Obtain all the children thread ids from the children field of the user threads
        const childThreadIDs = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, []);

        //Want to fetch all the children threads except those that are written by the user himself
        const replies = await Thread.find({
            _id: { $in: childThreadIDs },
            author: { $ne: userId },
        }).populate({
            path: 'author',
            model: 'User',
            select: 'name image _id'
        });

        //replies will be all the children threads that are children of the user's posts,
        //excluding the user's own comments on his own posts
        return replies;

    } catch (error: any) {
        throw new Error(`Cannot fetch activity: ${ error.message }`);
    }

}