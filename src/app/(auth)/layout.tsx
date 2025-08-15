import { isAuthenticated } from '@/lib/actions/auth.actions';
import { redirect } from 'next/navigation';
import  {ReactNode} from 'react'

async function AuthLayout({children}:{children:ReactNode}) {
    const isUserLoggedIn = await isAuthenticated();
        if(isUserLoggedIn){
            redirect('/');
        }
    return (
        <div className="auth-layout">{children}</div>
    )
}

export default AuthLayout
