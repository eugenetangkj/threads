import { currentUser } from "@clerk/nextjs";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { communityTabs} from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";


//View communities page
async function Page({ params }: { params: { id: string}}) {
    //Get current user
    const user = await currentUser();

    if (! user) {
        return null;
    }

    //Get information of the current community
    const communityDetails = await fetchCommunityDetails(params.id);

    return (
        <section>
            {/* Header, rendering community instead of profile details */}
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={user.id} //Who is viewing the profile
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type="Community"
            />
       
            {/* Tabs */}
            <div className='mt-9'>
                <Tabs defaultValue='threads' className='w-full'>
                    {/* Generate tab headers */}
                    <TabsList className='tab'>
                        {
                            communityTabs.map((tab) => (
                                <TabsTrigger key={ tab.label } value={ tab.value } className='tab'>
                                    <Image src={ tab.icon } alt={ tab.value } width={ 24 } height= { 24 }
                                        className='object-contain' />
                                    <p className='max-sm:hidden'>{ tab.label }</p>

                                    { tab.label === 'Threads' && (
                                        <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                            { communityDetails.threads?.length }
                                        </p>
                                    )}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>

                    {/* Generate tab content */}
                    <TabsContent value='threads' className='w-full text-light-1'>
                        <ThreadsTab
                            currentUserId={ user.id }
                            accountId={ communityDetails._id} //Fetch posts associated with the community
                            accountType="Community" />
                    </TabsContent>

                    <TabsContent value='members' className='w-full text-light-1'>
                        <section className='mt-9 flex flex-col gap-10'>
                            { communityDetails?.members.map((member: any) => (
                                <UserCard
                                    key={ member.id }
                                    id={ member.id }
                                    name={ member.name }
                                    username={ member.username}
                                    imgUrl={ member.image }
                                    personType="User"
                                />
                            ))}

                        </section>
                    </TabsContent>

                    <TabsContent value='requests' className='w-full text-light-1'>
                        
                    </TabsContent>
 
                </Tabs>
                

            </div>

        </section>
    )
}

export default Page;