"use server";
import { google } from "@ai-sdk/google";
import { db } from "../../../firebase/admin";
import { generateObject } from "ai";
import { feedbackSchema } from "../../../constant";

export async function getInterviewDataByUserId(
  userId: string,
): Promise<Interview[] | null> {
  try {
    console.log(userId);
    const response = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching interview data:", error);
    return null;
  }
}

export async function getAllInterviewData(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  try {
    const { userId, limit = 20 } = params;
    const response = await db
      .collection("interviews")
      .where("finalised", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const allInterviews = response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
    const otherUsersInterviews = allInterviews.filter(
      (interview) => interview.userId !== userId,
    );

    return otherUsersInterviews.slice(0, limit);
  } catch (error) {
    console.error("Error fetching interview data:", error);
    return null;
  }
}

export async function getInterviewDataById(
  id: string,
): Promise<Interview | null> {
  try {
    const response = await db.collection("interviews").doc(id).get();
    return response.data() as Interview | null;
  } catch (error) {
    console.error("Error fetching interview data:", error);
    return null;
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const { object } = await generateObject({
      // Use a valid, current model name
      model: google("gemini-2.5-flash"),
      schema: feedbackSchema,
      // ✅ 2. The prompt is updated to match the flattened schema
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        
        Transcript:
        ${transcript}

        Please provide a score from 0 to 100 for each of the following properties based on the transcript:
        - communicationScore
        - technicalKnowledgeScore
        - problemSolvingScore
        - culturalFitScore
        - confidenceScore
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    // ✅ 3. Destructure the flattened object returned by the AI
    const {
      communicationScore,
      technicalKnowledgeScore,
      problemSolvingScore,
      culturalFitScore,
      confidenceScore,
      strengths,
      areasForImprovement,
      finalAssessment,
    } = object;

    // ✅ 4. Process the AI's response on the server
    const scores = [
      communicationScore,
      technicalKnowledgeScore,
      problemSolvingScore,
      culturalFitScore,
      confidenceScore,
    ];
    const totalScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    const categoryScores = {
      CommunicationSkills: communicationScore,
      TechnicalKnowledge: technicalKnowledgeScore,
      ProblemSolving: problemSolvingScore,
      CulturalRoleFit: culturalFitScore,
      ConfidenceClarity: confidenceScore,
    };

    // ✅ 5. Build the final feedback object for the database
    const feedback = {
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;
    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}
