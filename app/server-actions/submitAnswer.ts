"use server";

import { db, realtimeDb } from "@/app/firebase-admin";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { session } from "@october-math-community-circle/shared-utitilies/proctoring";
import { serverActionWrapperRESPONSE } from "@/lib/server/serverActionWrapper";
import getUser from "@/lib/server/getUser";
import { FieldValue } from "firebase-admin/firestore";

async function submitAnswerInternal(
  competitionId: string,
  problemId: string,
  answer: number,
) {
  /* const user = await getUser();
  if (!user) throw new Error("Not authenticated");

  // Verify session is online
  const sessionRef = realtimeDb.ref(`/sessions/${competitionId}/${user.uid}`);
  const sessionSnap = await sessionRef.get();
  if (!sessionSnap.exists()) throw new Error("No active session");
  if ((sessionSnap.toJSON() as session)?.status === "offline")
    throw new Error("Session is offline");

  // Verify competition exists and is in progress
  const competitionDoc = await db
    .collection("competitions")
    .doc(competitionId)
    .get();
  if (!competitionDoc.exists) throw new Error("Competition not found");
  const competition = competitionDoc.data() as Competition;
  if (competition.status !== "in_progress")
    throw new Error("Competition is not in progress");

  // Validate problem index
  if (problemIndex < 0 || problemIndex >= competition.problems.length)
    throw new Error("Invalid problem index");

  const [problemId, problemTitle] = competition.problems[problemIndex];

  // Fetch the correct answer from the problems collection
  const problemDoc = await db.collection("problems").doc(problemId).get();
  if (!problemDoc.exists) throw new Error("Problem not found");

  // Save submission
  await db.collection("submissions").add({
    competitionId,
    problemId,
    problemTitle,
    answer,
    verdict: "correcting",
    submittedAt: FieldValue.serverTimestamp(),
    uid: user.uid,
  }); */

  return { verdict: "correcting" };
}

export const submitAnswer = serverActionWrapperRESPONSE(
  submitAnswerInternal,
  { verdict: "correcting" },
  "Failed to submit answer",
);
