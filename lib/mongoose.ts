import mongoose from "mongoose"; //Mongoose is needed to make connection between NodeJS and MongoDB

let isConnected = false; //Checks if mongoose is connected

export const connectToDB = async () => {
    mongoose.set('strictQuery', true); //Prevent unknown field queries

    if (! process.env.MONGODB_URL) {
        return console.log('MONGODB_URL is not found');
    }

    if (isConnected) {
        //Already connected to database
        return console.log('Already connected to MongoDB');
    }

    //Reach here means we have a MongoDB URL to try to connect to.
    //Can start to attempt the connection
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        //Successful connection
        console.log("Connected to MongoDB");
    } catch (error) {
        //Unsuccessful connection
        console.log('Error');

    }
}