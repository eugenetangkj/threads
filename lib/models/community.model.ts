import mongoose from 'mongoose';

//Model that interacts with the Community collection in the database
//Each community row is known as a document in the Community collection

const communitySchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,

    //Owner of the community
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],

    //List of members in the community
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});


const Community = mongoose.models.Community || mongoose.model('Community', communitySchema);

export default Community;