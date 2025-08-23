import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  consent : boolean;
  prevMessage: string[];
  newMessage: string;
  messageToSpeak: string;
  interviewInfo:{
        role: string | null,
        level: string | null,
        techstack: string | null,
        type: string | null,
        amount: number | null,
        userId: string | undefined | null
    }
    feedback:boolean
 
}

const initialState: CounterState = {
  consent : false,
    prevMessage: [],
    newMessage: "",
    messageToSpeak: "",
    interviewInfo: {
        role: null,
        level: null,
        techstack: null,
        type: null,
        amount: null,
        userId: null
    },
    feedback:false
    
   
}

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setInterviewRole: (state, action: PayloadAction<string>) => {
      state.interviewInfo.role = action.payload;
    },
    setInterviewLevel: (state, action: PayloadAction<string>) => {
      state.interviewInfo.level = action.payload;
    },
    setInterviewTechstack: (state, action: PayloadAction<string>) => {
      state.interviewInfo.techstack = action.payload;
    },
    setInterviewType: (state, action: PayloadAction<string>) => {
      state.interviewInfo.type = action.payload;
    },
    setInterviewAmount: (state, action: PayloadAction<number>) => {
      state.interviewInfo.amount = action.payload;
    },
    setInterviewUserId: (state, action: PayloadAction<string|undefined>) => {
      state.interviewInfo.userId = action.payload;
    },

    setMessageToSpeak: (state, action: PayloadAction<string>) => {
      state.messageToSpeak = action.payload;
    },

    setNewMessage: (state, action: PayloadAction<string>) => {
      state.newMessage =  action.payload;
    },

    setPrevMessage: (state, action: PayloadAction<string>) => {
      state.prevMessage.push(action.payload);
    },
    
    setConsent: (state, action: PayloadAction<boolean>) => {
      state.consent = action.payload;
    },
    setFeedback:(state,action:PayloadAction<boolean>)=>{
      state.feedback = action.payload;
    }
   
    
  },
})

// Action creators are generated for each case reducer function
export const { setFeedback,setConsent, setNewMessage,setPrevMessage, setMessageToSpeak, setInterviewRole, setInterviewLevel, setInterviewTechstack, setInterviewType,setInterviewAmount,setInterviewUserId  } = agentSlice.actions

export default agentSlice.reducer