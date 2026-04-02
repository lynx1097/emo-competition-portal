"use server";

import { db } from "@/app/firebase-admin";
import { Submission } from "@october-math-community-circle/shared-utitilies/submission";
import { serverActionWrapperRESPONSE } from "@/lib/server/serverActionWrapper";
import getUser from "@/lib/server/getUser";
import { Timestamp } from "firebase-admin/firestore";

async function getSubmissionsInternal(competitionId: string) {
  const user = await getUser();
  if (!user) throw new Error("Not authenticated");

  const snapshot = await db
    .collection("submissions")
    .where("uid", "==", user.uid)
    .where("competitionId", "==", competitionId)
    .orderBy("submittedAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Submission;
    return {
      ...data,
      id: doc.id,
      submittedAt: (data.submittedAt as Timestamp)?.toDate?.().toString() ?? "",
    };
  });
}

export const getSubmissions = serverActionWrapperRESPONSE(
  getSubmissionsInternal,
  [],
  "Failed to fetch submissions",
);
