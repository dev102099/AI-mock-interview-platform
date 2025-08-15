import React from 'react'
import Link from "next/link";
import { isAuthenticated } from '@/lib/actions/auth.actions';
import { redirect } from 'next/navigation';

async function Layout({children}: {children: React.ReactNode}) {

    const isUserLoggedIn = await isAuthenticated();
    if(!isUserLoggedIn){
        redirect('/sign-in');
    }
    
    return (
        <div className={"root-layout"}>
<nav>
    <Link href={"/"} className={"flex item-center gap-2"}>
        <img src={"/logo.svg"} width={38} height={32} alt={"logo"} />
        <h2 className={"text-primary-100"}>Interview Buddy</h2>
    </Link>
</nav>
            {children}
        </div>
    )
}

export default Layout
