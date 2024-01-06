"use client";

import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';


function Bottombar() {
    const pathname = usePathname();

    return (
        <section className='bottombar'>
            <div className='bottombar_container'>
                { sidebarLinks.map((link) => {
                        //Checks which link is currently active
                        const isActive = (pathname.includes(link.route) && link.route.length > 1) ||
                                        (pathname === link.route);
                        
                        return (
                        <Link
                        href={ link.route }
                        key={ link.label }
                        className={ `bottombar_link ${isActive && 'bg-primary-500'} `}>
                        
                            <Image alt={ link.label } src={link.imgURL} width={24} height={24} />
                            <p className='text-subtle-medium text-light-1 max-small:hidden'>
                                { link.label.split(/\s+./)[0]}
                            </p>

                        </Link>
                        )
                })}
               
            </div>
        </section>
    );
}

export default Bottombar;