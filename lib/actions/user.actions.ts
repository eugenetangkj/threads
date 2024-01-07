"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

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