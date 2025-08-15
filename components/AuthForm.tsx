"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "./ui/button"
import {
    Form,

} from "./ui/form"
import Link from "next/link";
import {toast} from "sonner";
import FormField from "./FormField";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@firebase/auth";
import {auth} from "../firebase/Client";
import {signIn, signUp} from "@/lib/actions/auth.actions";


const authFormSchema = (type:string) =>{
    return z.object({
        name: type==='sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
    })
}


function AuthForm({type}:{type:string}) {
    const router  = useRouter()
const formSchema = authFormSchema(type);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:"",
            email:"",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
if(type==='sign-up'){
    

    const { name, email, password } = values;
    const userCred = await createUserWithEmailAndPassword(auth,email,password);
    const result = await signUp({
        uid:userCred.user.uid,
        name:name!,
        email,
        password
    })
    if(!result?.success){
        toast.error(result?.message);
        return;
    }
   toast.success("Account created, redirecting to sign-in page")
    router.push("/sign-in")

}else{
    
    const { email, password } = values;
    const userCred = await signInWithEmailAndPassword(auth,email,password);
    const idToken = await userCred.user.getIdToken();
    if(!idToken){
        toast.error("SignIn Failed.");
        return;
    }
    await signIn({email,idToken})

    toast.success("Successfull Sign In. Redirecting to home page")
    router.push("/")

}
        }catch (error) {
            console.log(error)
            toast.error(`There was an error: ${error}` )

        }
    }
    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <img src={"/logo.svg"} alt="logo" height={32} width={38}/>
                    <h2 className="text-primary-100">Interview Buddy</h2>
                </div>
                <h3 className="self-center">Practice job interview with AI</h3>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
                    {type!="sign-in" && <FormField control={form.control} name="name" label="Name" placeholder="Your Name"/>}
                    <FormField control={form.control} name={"email"} label={"Email"} type={"email"} placeholder={"Your Email Address"}/>
                    <FormField control={form.control} name={"password"} type={"password"} label={"Password"} placeholder={"Your Password"}/>

                    <Button type="submit" className="btn">{type!="sign-in" ? "Create an Account":"Sign In"}</Button>
                </form>
                <p className="text-center">
                    {type==="sign-in" ? "No account yet?" : "Already have an account?"}
                    <Link className="font-bold text-user-primary ml-1" href={type==="sign-in" ? "/sign-up":"/sign-in"}>
                        {type==="sign-in" ? "Sign Up" : "Sign In"}
                    </Link>
                </p>

            </Form>
            </div>
        </div>
    )
}

export default AuthForm
