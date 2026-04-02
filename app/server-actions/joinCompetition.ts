"use server";

import { db } from "@/app/firebase-admin";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { serverActionWrapperRESPONSE } from "@/lib/server/serverActionWrapper";
import getUser from "@/lib/server/getUser";
import { AccessToken } from "livekit-server-sdk";

async function joinCompetitionInternal(competitionId: string) {
  const user = await getUser();
  const competitionDoc = await db
    .collection("competitions")
    .doc(competitionId)
    .get();
  if (!competitionDoc.exists) {
    throw new Error("Competition doesn't exist");
  }

  const competitionData = competitionDoc.data() as Competition;
  if (competitionData.status !== "in_progress") {
    throw new Error("Competition hasn't started");
  }

  const existingRegistration = await db
    .collection("registrations")
    .where("uid", "==", user?.uid)
    .where("competitionId", "==", competitionId)
    .where("expired", "==", false)
    .limit(1)
    .get();

  if (existingRegistration.empty) {
    throw new Error("You are not registered for this competition");
  }
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: user?.uid,
      metadata: JSON.stringify({ role: "student" }),
      name: user?.email,
    },
  );
  at.addGrant({
    roomJoin: true,
    room: competitionId,
    canPublish: true,
    canSubscribe: false,
    canPublishData: true,
  });
  const token = at.toJwt();
  //revalidatePath("/student");
  return token;
}
export const joinCompetition = serverActionWrapperRESPONSE(
  joinCompetitionInternal,
  "",
  "Failed to join competition",
);
