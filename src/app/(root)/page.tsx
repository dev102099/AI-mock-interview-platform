import React from 'react'
import {Button} from "../../../components/ui/button";
import Link from "next/link";
import InterviewCard from "../../../components/InterviewCard";
import { getAllInterviewData, getInterviewDataByUserId } from '@/lib/actions/general.actions';
import { getCurrentUser, logOut } from '@/lib/actions/auth.actions';



async function Home() {
    const userData = await getCurrentUser();
    
    const [interviewCardData,allInterviewCardData] = await Promise.all([
         getInterviewDataByUserId(userData?.id!),
         getAllInterviewData({
            userId: userData?.id!})
    ]);
   
    const hasPastInterviews = interviewCardData && interviewCardData.length > 0;
    const getLatestInterviews = allInterviewCardData && allInterviewCardData.length > 0;
    return (
        <>
        <section className={"card-cta"}>
            <div className={"flex flex-col gap-6 max-w-lg"}>
                <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                <p>
                    Practice on real interview question & get instant feedback
                </p>
                <div className='flex flex-row gap-4'>
                    <Button asChild className={"btn-primary max-sm:w-full"}>
                    <Link href={"/interview"}>Create an Interview</Link>
                </Button>
                <Button asChild onClick={logOut} className={"btn-primary max-sm:w-full"}>
                    <span>Log Out</span>
                </Button>
                </div>
                
            </div>
            <img src={"/robot.png"} alt="Robot" className={"max-sm:hidden"} height={400} width={400} />
        </section>

            <section className={"flex flex-col gap-6 mt-8"}>
                <h2>Your Interviews</h2>
                <div className={"interviews-section"}>
                    {hasPastInterviews ? interviewCardData.map((interviews) => {
                        return <InterviewCard {...interviews} key={interviews.id}/>
                    }) : <p>You have no past interviews.</p>}
                    
                </div>
            </section>

            <section className={"flex flex-col gap-6 mt-8"}>
                <h2>Take an Interview</h2>
                <div className={"interviews-section"}>
                    {getLatestInterviews ? allInterviewCardData.map((interviews) => {
                        return <InterviewCard {...interviews} key={interviews.id}/>
                    }) : <p>There are no interviews available.</p>}
                </div>
                
            </section>
        </>
    )
}

export default Home
