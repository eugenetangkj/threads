## Threads Clone
_A project created through Javascript Mastery's [video tutorial](https://www.youtube.com/watch?v=O5cmLDVTgAs) for an introduction to MongoDB and Clerk. You can access the web app [here](https://threads-topaz-eta.vercel.app/)._ 


<img src="public/assets/github-splash.png" width="700" />

### Features
1. User authentication with Google, GitHub and email via [Clerk](https://www.clerk.com) 👨
2. Search users 🔎
3. Track activity (e.g. Other's comments on your threads) 📅
4. Create thread 📝
5. Communities (implemented using Clerk organisations) 👪
6. View profile information 😃

### Learning Points
**1. MongoDB (NoSQL)**

I have previously used Firebase/Firestore for NoSQL, and it is my first time utilising MongoDB in a web application. I have learnt how collections and documents work in MongoDB, and how to integrate my MongoDB database with NextJS.

This can be done by creating models with schemas defined in code, using [mongoose](https://mongoosejs.com/) in Node.JS. With models, I can then create actions with queries that utilise the models to query the collections and fetch the relevant documents. Another learning point is also how to join collections together, such as using  `mongoose.Schema.Types.ObjectId` to link to another model and thereafter, utilise mongoose's `populate()` method to fill up the linked fields. In my opinion, this is similar to the concept of foreign keys in relational database management systems, which I am more familar with.

**2. Clerk**

This is honestly a great takeaway from this educational project. Previously, to do authentication, such as in Firebase Authentication, we have to create our own React forms and pass the user data to Firebase API. However, with Clerk, it is seriously a breeze to set up authentication in a fast and secure manner. I got to be exposed to Clerk's sign-in component and just by importing the Clerk libraries, I am able to use the `<SignIn />` component which sets up all the necessary authentication sign in/sign up features. It also provides middleware code as available on its documentation, and the middleware allows protection of routes.

Apart from authentication, Clerk provides the feature of organisations, which ties in well with the community feature of this Threads application. This exposed me to the concept of **web hooks**, because we need to link Clerk's organisation information with the community collection in the database. In other words, webhooks are needed to sync data between Clerk and our database, such that changes to the Clerk instance are directly populated to the database automatically. I saw how to create webhook routes that listens to Clerk's organisation events and created a webhook API endpoint on Clerk to the webpage. Then, whenever organisation events are detected, it will run the corresponding API routes and update the database using server-side code accordingly.

**3. shadcn**

I was introduced to shadcn and how to use it to easily import beautiful UI components for modification into NextJS. This makes development much faster as there are pre-built component such as forms and tabs that we can easily modify to suit our purpose.


**4. Next.JS**

I previously had experience with Next.JS but was using the old Page Router. This project introduced me to NextJS's **App Router** and how to use the new file conventions to create pages and layouts. Also, I learnt more about the concept of server-side rendering, and how NextJS allows us to use actions to directly interact with the database. This means our single NextJS repository can act as both the client and server-side code, as it has primarily server-side components that can be rendered on server and displayed to users faster, and how actions are hosted on server-side to fetch data to and fro the database. 

**5. uploadthing**

I had the chance to experiment with [uploadthing](https://uploadthing.com/) to manage file hosting with the NextJS applications so user files can be uploaded and managed on uploadthing.



### Disclaimers
I created this web application by going through the [tutorial](https://www.youtube.com/watch?v=O5cmLDVTgAs) hosted by Javascript Mastery. It is meant to be an educational project to expose me the areas of web development that I did not have before. Namely:
- Usage of NoSQL such as MongoDB and integrating it with Next.JS
- Introduction of [Clerk](https://www.clerk.com) and how to set it up for seamless and secure user authentication
- Exposure to pre-built web UI components such as [shadcn](https://ui.shadcn.com/)

As such, most of the code written comes from me going through and referencing the tutorial. Neverthless, it was fun learning and trying it out myself. I would highly recommend this tutorial as it not only provides a good introduction to the above tech stack, but Javascript Mastery also delves into the details of NextJS such as how server-side rendering works and how we can utilise actions to directly connect to the database on the server-side. 👍