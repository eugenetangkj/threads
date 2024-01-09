import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

//Onboarding page
async function Page() {
    //Get current user that is signed in
    const user = await currentUser();

    if (! user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded) {
        //Should not onboard twice
        redirect("/");
    }


    //Get user information
    const userData = {
        id: user.id,
        objectId: userInfo?._id, //Object id of the user as stored in the database
        username: userInfo ? userInfo?.username : user?.username, //Can either get from Clerk or from database
        name: userInfo ? userInfo?.name : user?.firstName ?? "", //May be empty if dont have username
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user.imageUrl,
    };


    return(
        <main className='mx-auto flex flex-col max-w-3xl justify-start px-10 py-20'>
            <h1 className='head-text'>Onboarding</h1> 
            <p className='mt-3 text-base-regular text-light-2'>Complete your profile now to use Threads</p>   
        
            <section className='mt-9 bg-dark-2 p-10'>
                <AccountProfile user={ userData } btnTitle="Continue" />


            </section>
        
        </main>
    )
}

export default Page;