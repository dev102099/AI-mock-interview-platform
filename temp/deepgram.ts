"use client";
import { useSelector } from "react-redux";

export async function greetings(
  isSpeaking: React.Dispatch<React.SetStateAction<boolean>>,
  text: string,
) {
  try {
    const response = await fetch("/api/deepgram/tts", {
      method: "POST",
      body: JSON.stringify({
        textToSpeak: text,
      }),
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
    audio.onplay = () => {
      isSpeaking(true);
    };
    audio.onended = () => {
      isSpeaking(false);
    };
    audio.play();
  } catch (error) {
    console.error("Error playing audio:", error);
  }
}

export async function gatherInfo() {}

export async function stt(audioBlob: Blob) {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");

    // Send the file to your server-side API route
    const response = await fetch("/api/deepgram/stt", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      return result.transcription.results.channels[0].alternatives[0]
        .transcript;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Error transcribing audio:", error);
  }
}

export async function geminiCall(
  newMessage: string,
  prevMessage: string[],
  statusViseMessage: string,
  rules: string,
) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newMessage,
        prevMessage,
        statusViseMessage,
        rules,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to call Gemini API");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {}
}

export async function apiCall(interviewInfo: any) {
  try {
    const response = await fetch("/api/interview/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: interviewInfo.role,
        level: interviewInfo.level,
        techstack: interviewInfo.techstack,
        type: interviewInfo.type,
        amount: interviewInfo.amount,
        userid: interviewInfo.userId,
      }),
    });
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

/*async function workflow(){
  greetings();
  gatherInfo();
  apiCall();

}*/
