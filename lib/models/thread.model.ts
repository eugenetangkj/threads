import mongoose from 'mongoose';

//Model that interacts with the Thread collection in the database
//Each thread row is known as a document in the Thread collection

const threadSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId: {
        type: String //If this thread is a comment, it will have a parent
    },
    children: [
        //Comments on this given thread
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ]
});

//Initialise the mongoose mongodb Thread model
const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema);

export default Thread;