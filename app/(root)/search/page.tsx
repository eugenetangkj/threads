import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

//Search page
async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined};
}) {
    //Get current user
    const user = await currentUser();

    if (! user) {
        return null;
    }

    const userInfo = await fetchUser(user.id);

    if (! userInfo?.onboarded) {
        redirect('/onboarding');
    }

    //Fetch list of users from database
    const result = await fetchUsers({
        userId: user.id,
        searchString: searchParams.q,
        pageNumber: searchParams?.page ? + searchParams.page : 1,
        pageSize: 25,
    })

    return (
        <section>
            <h1 className='head-text mb-10'>Search</h1>
            
            {/* Search bar */}
            <Searchbar routeType='search' />

            <div className='mt-14 flex flex-col gap-9'>
                { result.users.length === 0
                  ? <p className='no-result'>No users</p>
                  : (
                    <>
                        {result.users.map((person) =>
                            <UserCard
                            key={ person.id }
                            id={ person.id }
                            name={ person.name }
                            username={ person.username }
                            imgUrl={ person.image }
                            personType='User'
                            
                            />
                        )}
                    
                    
                    </>
                  )

            }
            </div>
        </section>
    )
}

export default Page;