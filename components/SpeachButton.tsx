'use client'

import React from 'react'
import { speak } from '../speech'

function SpeachButton() {
  return (
    <div>
      <button className='btn-primary' onClick={speak}>click me</button>
    </div>
  )
}

export default SpeachButton
