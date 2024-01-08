import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comment from "@/components/forms/Comment";

const Page = async ({ params }: { params: { id: string }}) => {
    if (! params.id) {
        return null;
    }

    //Get current user
    const user = await currentUser();
    if (! user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);
    if (! userInfo?.onboarded) {
        //User has not onboarded. Redirect to onboarding
        redirect('/onboarding');
    }

    //Get current thread information
    const thread = await fetchThreadById(params.id);

    return(
    <section className='relative'>
        {/* Thread details */}
        <div>
            <ThreadCard
                key={thread.id}
                id={thread.id}
                currentUserId={user?.id || ''}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
            />
        </div>

        {/* Reply to thread form */}
        <div className='mt-7'>
            <Comment
                threadId={ thread.id }
                currentUserImg={ user.imageUrl }
                currentUserId={ JSON.stringify(userInfo._id) }
            
            />
        </div>
    </section>
    );

}

export default Page;