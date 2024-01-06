"use client";

import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { SignedIn, SignOutButton } from '@clerk/nextjs';

//Left side bar in the main menu page
function LeftSidebar() {
    
    const router = useRouter();
    const pathname = usePathname();
    return (
        <section className='custom-scrollbar leftsidebar'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                { sidebarLinks.map((link) => {
                    //Checks which link is currently active
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                                     (pathname === link.route);
                    
                    return (
                    <Link
                    href={ link.route }
                    key={ link.label }
                    className={ `leftsidebar_link ${isActive && 'bg-primary-500'} `}>
                    
                        <Image alt={ link.label } src={link.imgURL} width={24} height={24} />
                        <p className='text-light-1 max-lg:hidden'>{ link.label }</p>

                    </Link>
                    )
                })}
            </div>

            {/* Logout */}
            <div className='mt-10 px-6'>
                {/* Things that will appear if user is signed in  */}
                <SignedIn>
                    {/* Redirect user to sign in page once user clicks sign out button */}
                    <SignOutButton signOutCallback={ () => router.push('/sign-in')}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                        <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
                        <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton> 
                </SignedIn>

            </div>
            
        </section>
    )
}

export default LeftSidebar;