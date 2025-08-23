import { getInterviewDataById } from '@/lib/actions/general.actions';
import { getRandomInterviewCover } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react'
import TechIcons from '../../../../../components/TechIcons';
import Agent from '../../../../../components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.actions';

async function page({params}:RouteParams) {
    const {id} = await params;
    const interview = await getInterviewDataById(id);
    
    const user = await getCurrentUser();
    if(!interview){
        return redirect('/');
    }
    
  return (
    <>
    <div className='flex flex-row gap-4 justify-between'>
        <div className='flex flex-row gap-4 items-center max-sm:flex-col'>
            <div className='flex flex-row gap-4 items-center'>
                <img src={getRandomInterviewCover()} alt="Cover Image" width={40} height={40} className='rounded-full object-cover size-[40px]' />
                <h3 className='capitalize'>{interview.role} Interview</h3>
            </div>
            <TechIcons techStack={interview.techstack} />   
        </div>
        <p className='bg-dark-200 px-4 py-2 rounded-lg h-fit capitalize'>{interview.type}</p>
    </div>
    <Agent userName={user?.name} userId={user?.id} interviewId={id} type='interview' questions={interview.questions}/>
    </>
  )
}

export default page
