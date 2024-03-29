import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

//Top navigation bar
function Topbar() {
    return (
        <nav className='topbar'>
            <Link href='/' className='flex items-center gap-4'>
                <Image src='/assets/logo.svg' alt='Logo' width={28} height={28} />
                <p className='text-heading3-bold text-light-1 max-xs:hidden'>Threads</p>
            </Link>

            <div className='flex items-center gap-1'>
                {/* Mobile responsive */}
                <div className='block md:hidden'>
                    <SignedIn>
                        {/* Things that will appear if user is signed in  */}
                        <SignOutButton>
                            <div className='flex cursor-pointer'>
                            <Image src='/assets/logout.svg' alt='logout' width={24} height={24} />

                            </div>
                        </SignOutButton> 
                    </SignedIn>
                </div>

                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: 'py-2 px-4'
                        }
                    }} />
            </div>


        </nav>
    );
}

export default Topbar;