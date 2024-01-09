import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { profileTabs } from "@/constants";


//Profile page
async function Page({ params }: { params: { id: string}}) {
    //Get current user
    const user = await currentUser();

    //No user is logged in. Should not allow access of profile pages, so return null
    if (! user) {
        return null;
    }

    //Get information of the user whose profile is being viewed
    const userInfo = await fetchUser(params.id);

    const currentUserInfo = await fetchUser(user.id);

    if (! currentUserInfo?.onboarded) {
        //User has not onboarded. Redirect to onboarding page and do not allow viewing of profiles
        redirect('/onboarding');
    }


    return (
        <section>
            {/* Header */}
            <ProfileHeader
                accountId={userInfo.id} //Whose profile are we looking at
                authUserId={user.id} //Who is viewing the profile
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />
       
            {/* Tabs */}
            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    <TabsList className='tab'>
                        {
                            profileTabs.map((tab) => (
                                <TabsTrigger key={ tab.label } value={ tab.value } className='tab'>
                                    <Image src={ tab.icon } alt={ tab.value } width={ 24 } height= { 24 }
                                        className='object-contain' />
                                    <p className='max-sm:hidden'>{ tab.label }</p>

                                    { tab.label === 'Threads' && (
                                        <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                            { userInfo?.threads?.length }
                                        </p>
                                    )}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    { profileTabs.map((tab) => (
                        <TabsContent key={`content-${ tab.label }`} value={ tab.value } className='w-full text-light-1'>
                            <ThreadsTab
                                currentUserId={ user. id }
                                accountId={ userInfo.id}
                                accountType="User" />
                        </TabsContent>

                    ))}
                </Tabs>
                

            </div>

        </section>
    )
}

export default Page;