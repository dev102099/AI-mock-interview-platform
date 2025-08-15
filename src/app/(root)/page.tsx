import React from 'react'
import {Button} from "../../../components/ui/button";
import Link from "next/link";
import {dummyInterviews} from "../../../constant";
import InterviewCard from "../../../components/InterviewCard";
import { speak } from '../../../speech';
import SpeachButton from '../../../components/SpeachButton';

function Home() {
    return (
        <>
        <section className={"card-cta"}>
            <div className={"flex flex-col gap-6 max-w-lg"}>
                <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                <p>
                    Practice on real interview question & get instant feedback
                </p>
                <Button asChild className={"btn-primary max-sm:w-full"}>
                    <Link href={"/interview"}>Start an Interview</Link>
                </Button>
            </div>
            <img src={"/robot.png"} alt="Robot" className={"max-sm:hidden"} height={400} width={400} />
        </section>

            <section className={"flex flex-col gap-6 mt-8"}>
                <h2>Your Interviews</h2>
                <div className={"interviews-section"}>
                    {dummyInterviews.map((interviews)=>{
                        return <InterviewCard {...interviews} key={interviews.id}/>
                    })}
                </div>
            </section>

            <section className={"flex flex-col gap-6 mt-8"}>
                <h2>Take an Interview</h2>
                <div className={"interviews-section"}>
                    {dummyInterviews.map((interviews)=>{
                        return <InterviewCard {...interviews} key={interviews.id}/>
                    })}
                </div>
                <SpeachButton/>
            </section>
        </>
    )
}

export default Home
