"use client";

import { Competition } from "@october-math-community-circle/shared-utitilies/competition";
import { Registration } from "@october-math-community-circle/shared-utitilies/registration";
import { CompetitionCard } from "./CompetitionCard";
import { Trophy, Info } from "lucide-react";
import ViewMedia from "./ViewMedia";

export default function StudentPage({
  registrations,
  competitions,
  blockedCompetitions,
}: {
  registrations: Registration[];
  competitions: Competition[];
  blockedCompetitions: { competitionId: string; studentUid: string }[];
}) {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <header className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Competition Hub
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">
              Discover and join upcoming mathematical challenges.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Trophy className="h-8 w-8" />
          </div>
        </header>

        {/* Competitions Grid */}
        {competitions.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {competitions.map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                isJoined={false}
                isBlocked={Boolean(
                  blockedCompetitions.find(
                    (blocked) => blocked.competitionId === competition.id,
                  ),
                )}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-4xl border-2 border-dashed border-border py-24 text-center bg-card/30">
            <div className="mb-6 rounded-3xl bg-muted/50 p-6">
              <Info className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              No Active Competitions
            </h3>
            <p className="mt-2 max-w-sm text-lg text-muted-foreground">
              We&apos;re currently preparing new challenges. Stay tuned for more
              mathematical excitement!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
