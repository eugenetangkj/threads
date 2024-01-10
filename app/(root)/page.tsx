import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
 
//Home page that displays all the given threads
export default async function Home() {
  const result = await fetchPosts(1, 30);
  
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
      <h1 className='head-text text-left'>Home</h1>

      <section className='mt-9 flex flex-col gap-10'>
        { result?.posts.length === 0
          ? (<p className='no-result'>No threads available</p>)
          : (
              <>
                {result?.posts.map((post) => (
                  <ThreadCard
                    key={post.id}
                    id={post.id}
                    currentUserId={user?.id || ''}
                    parentId={post.parentId}
                    content={post.text}
                    author={post.author}
                    community={post.community}
                    createdAt={post.createdAt}
                    comments={post.children}
                  />
                ) )}
              </>
          )
      
      
      }

      </section>
    </>
  )
}