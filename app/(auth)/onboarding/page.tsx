import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

//Onboarding page
async function Page() {
    //Get current user that is signed in
    const user = await currentUser();

    const userInfo = {};

    //Get user information
    const userData = {
        id: user?.id,
        objectId: userInfo?.id, //Object id of the user as stored in the database
        username: userInfo?.username || user?.username, //Can either get from Clerk or from database
        name: userInfo?.name || user?.firstName || "", //May be empty if dont have username
        bio: userInfo?.bio || "",
        image: userInfo?.image || user.imageUrl,
    }


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