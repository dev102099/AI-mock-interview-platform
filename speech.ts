// Simple JavaScript example


export const speak =()=>{
const utterance = new SpeechSynthesisUtterance("Hello, I am your interview agent. Let's begin.");

// You can optionally select a voice
// const voices = window.speechSynthesis.getVoices();
// utterance.voice = voices[0]; // Choose a specific voice

// Speak the text
window.speechSynthesis.speak(utterance);}