import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
  try {
    // Initialize the Deepgram client on the server
    const {textToSpeak}=await request.json();
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);
    const text = textToSpeak

    // Make the request to Deepgram's TTS API
    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-2-thalia-en",
        encoding: "linear16",
        container: "wav"
      }
    );

    // Get the audio data as a stream
    const stream = await response.getStream();

    if (stream) {
      // Stream the audio data directly back to the client
      return new NextResponse(stream, {
        headers: {
          "Content-Type": "audio/wav",
        },
      });
    } else {
      throw new Error("Failed to get audio stream from Deepgram.");
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}