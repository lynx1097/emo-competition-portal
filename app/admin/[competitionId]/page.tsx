import getUser from "@/lib/server/getUser";
import { redirect } from "next/navigation";
import ProctoringDashboard from "./proctoringDashboard";
import { db } from "@/app/firebase-admin";
import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { startProctoring } from "@/app/server-actions/proctor";

async function page({
  params,
}: {
  params: Promise<{ competitionId: string }>;
}) {
  const user = await getUser();
  if (!user) redirect("/");
  if (user.role != "admin") redirect("/");
  const { competitionId } = await params;
  const competition = await db
    .collection("competitions")
    .doc(competitionId)
    .get();
  if (!competition.exists) redirect("/admin");
  const competitionData = competition.data() as Competition;
  if (competitionData.status != "in_progress") redirect("/admin");
  const liveKitToken = await startProctoring(competitionId);
  if (liveKitToken.success == false) redirect("/admin");
  return (
    <ProctoringDashboard
      liveKitToken={liveKitToken.success ? liveKitToken.data : ""}
      competitionId={competitionId}
    />
  );
}

export default page;
