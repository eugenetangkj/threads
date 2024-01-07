import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import PostThread from "@/components/forms/PostThread";


//Create thread page
async function Page() {
    //Get current user to know who is going to create the thread
    const user = await currentUser();

    //No user is logged in. Should not allow creation of thread, so return null
    if (! user) {
        return null;
    }

    //Get user information
    const userInfo = await fetchUser(user.id);

    if (! userInfo?.onboarded) {
        //User has not onboarded. Redirect to onboarding page and do not allow
        //creation of threads
        redirect('/onboarding');
    }


    return (
        <>
            <h1 className='head-text'>Create Thread</h1>

            <PostThread userId={ userInfo._id } />
        </>
    );
    
    


}

export default Page;