"use server";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { db } from "../firebase-admin";
import getUser from "@/lib/server/getUser";
import { serverActionWrapperRESPONSE } from "@/lib/server/serverActionWrapper";
import { AccessToken } from "livekit-server-sdk";

async function startProctoringInternal(competitionId: string) {
  const user = await getUser();
  if (user?.role != "admin")
    throw new Error("You are not authorized to start proctoring");
  const competition = await db
    .collection("competitions")
    .doc(competitionId)
    .get();
  if (!competition.exists) {
    throw new Error("Competition doesn't exist");
  }
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: user?.uid },
  );
  at.addGrant({
    roomJoin: true,
    room: competitionId,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });
  const token = await at.toJwt();
  return token;
}
export const startProctoring = serverActionWrapperRESPONSE(
  startProctoringInternal,
  "",
  "Failed to start proctoring",
);
