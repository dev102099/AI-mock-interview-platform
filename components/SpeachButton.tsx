'use client'

import React from 'react'
import { playAudio } from '../temp/deepgram';


function SpeachButton() {
  
 const handleButtonClick = async () => {
    try {
      // 1. Call YOUR server's API endpoint, not the Deepgram function directly
      const response = await fetch('/api/openai', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error("Server responded with an error.");
      }
      
      // 2. Get the audio data as a Blob
      const audioBlob = await response.blob();
      
      // 3. Create a temporary URL from the Blob
      const audioUrl = URL.createObjectURL(audioBlob);

      // 4. Create a new Audio object and play it
      const audio = new Audio(audioUrl);
      audio.play();
      
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };
  return (
    <div>
      <button className='btn-primary' onClick={handleButtonClick}>click me</button>
    </div>
  )
}

export default SpeachButton
