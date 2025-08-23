'use client'

import React, { useState, useRef } from 'react';
import { stt } from '../temp/deepgram';
import { setNewMessage } from '../redux/stateSlice/agentSlice';
import { useDispatch } from 'react-redux';


// --- 1. Style definitions for the glowing animation ---
// It's often easiest to add keyframe animations in a style tag or your global CSS file.
const animationStyle = `
  @keyframes red-glow {
    0%, 100% {
      box-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444, 0 0 30px #ef4444;
    }
    50% {
      box-shadow: 0 0 20px #f87171, 0 0 30px #f87171, 0 0 40px #f87171;
    }
  }
  .animate-red-glow {
    animation: red-glow 1.5s infinite ease-in-out;
  }
`;

// --- 2. The MicIcon Component ---



interface MicIconProps {
  /**
   * Callback function that receives the audio blob and its URL when recording stops.
   */
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  isSpeaking : boolean;
}

const MicIcon: React.FC<MicIconProps> = ({ onRecordingComplete , isSpeaking}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          onRecordingComplete(audioBlob, audioUrl);
          stream.getTracks().forEach(track => track.stop()); // Turn off mic indicator
        };

        recorder.start();
      } catch (error) {
        console.error("Error accessing microphone:", error);
        alert("Microphone access was denied. Please allow microphone access in your browser settings.");
      }
    }
    setIsRecording(!isRecording);
  };

  const buttonClasses = `
    rounded-full w-24 h-24 flex items-center justify-center 
    shadow-lg transition-all duration-300 focus:outline-none 
    transform hover:scale-105
    ${isRecording 
      ? 'bg-red-500 animate-red-glow' 
      : 'bg-gray-600 hover:bg-gray-700'
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <button
      disabled={isSpeaking}
        onClick={handleToggleRecording}
        className={buttonClasses}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"></path>
        </svg>
      </button>
    </>
  );
};


// --- 3. Example Parent Component (App.tsx) ---
// This shows how you would use the MicIcon component on your page.

export default function App({speaking}:{speaking:boolean}) {
const dispatch = useDispatch();
const handleStt = async (audioBlob: Blob) => {

    try {
      // 1. Get the transcript data from your utility function
      const transcript: string = await stt(audioBlob);

      // 2. Dispatch the data from within the component
      if (transcript) {
        dispatch(setNewMessage(`User said : ${transcript}`));
      }
    } catch (error) {
      // Handle any errors from the stt function here
      console.error("Failed to process recording:", error);
    }
  };

  const [lastRecordingUrl, setLastRecordingUrl] = useState<Blob | null>(null);

  const handleAudioRecording = (audioBlob: Blob, audioUrl: string) => {
    console.log("Recording finished! Blob and URL are available.");
    setLastRecordingUrl(audioBlob);
    handleStt(audioBlob); // Call the upload and transcribe function
  };

  return (
    
        
        <div className="flex justify-center">
          <MicIcon isSpeaking={speaking}  onRecordingComplete={handleAudioRecording} />
        </div>

      
  );
}



