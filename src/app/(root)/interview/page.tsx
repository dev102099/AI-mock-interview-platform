import React from 'react'
import Agent from '../../../../components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.actions'

async function Interview() {
  const response = await getCurrentUser();
  return (
   <>
   {console.log(response)}
   <h3>Interview Generation</h3>
   <Agent userId={response?.id} userName={response?.name} type='generate'/>
   </>
  )
}

export default Interview
