'use server';

import {auth, db} from "../../../firebase/admin";
import {cookies} from "next/headers";

export async function signUp(params:SignUpParams){
    const {uid,name,email} = params;
    try{
const getUser = db.collection("users").doc(uid).get();
if(getUser.exists){
return {
    success:false,
    message:"User already exists.Please proceed to sign in."
}
}
await db.collection("users").doc(uid).set({name,email});
return {
    success:true,
    message:'User created successfully.'
}
    }catch(e:any){
        console.error("Error creating your account.",e);
        if(e.code==='auth/mail-already-existes'){
            return{
                success:false,
                message:"Email already exist",
            }
        }
        return {
            success:false,
            message:"failed to create an account"
        }
    }
}

export async function signIn(params:SignInParams){
    const {idToken,email} = params;
    try{
        const getUser = await auth.getUserByEmail(email);
        if(!getUser)
        {
            return {
                success:false,
                message:"User does not exist. Please proceed to sign up."
            }
        }
        await setSessionCookie(idToken);


    }catch (e:any){
        console.log(e);
        return{
            success:false,
            message:"Failed to login."
        }

    }
}

export async function setSessionCookie(idToken:string){
    const ONE_WEEK = 60 * 60 * 24 * 7;
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK * 1000
    })
    cookieStore.set('session',sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        sameSite:'lax',
        secure:process.env.NODE_ENV==='production',
        path:'/'
    })
}

export async function getCurrentUser(): Promise<User|null>{
const cookieStore = await cookies();
const sessionCookie = cookieStore.get('session')?.value;
if(!sessionCookie){
    return null;
}
try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const user = await db.collection("users").doc(decodedClaims.uid).get();
    if (!user.exists) {
        return null;
    }
    return {
        ...user.data(),
        id:user.id
    } as User

} catch (error) {
    console.error("Error getting current user:", error);
    return null;
    
}
}

export async function isAuthenticated(){
    const user = await getCurrentUser();
    return !!user
}
