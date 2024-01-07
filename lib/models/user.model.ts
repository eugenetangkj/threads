import mongoose from 'mongoose';

//Model that interacts with the User collection in the database
//Each user row is known as a document in the User collection

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: String,
    bio: String,

    //This means that one user can have references to
    //multiple thread objects in the schema Thread
    //stored in the database
    threads: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread'
        }
    ],

    onboarded: {type: Boolean, default: false},

    //One user can belong to multiple communities
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ]
})

//The first time we run this, there is no User model in all our models. Thus, it relies
//on the second option to create a User model using the userSchema. Afterwards, once the
//User model has been created, we can just retrieve it from the list of models.
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;