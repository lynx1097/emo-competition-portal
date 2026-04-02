import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { roomName, participantName, role } = await req.json();

    if (!roomName || !participantName || !role) {
      return NextResponse.json(
        { error: "Missing defined parameters" },
        { status: 400 },
      );
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "LiveKit server misconfigured" },
        { status: 500 },
      );
    }

    // Role-based logic
    // Contestant can only publish camera and screen share. Cannot subscribe.
    // Admin can subscribe, and has admin rights. Cannot publish.
    const isContestant = role === "contestant";
    const isAdmin = role === "admin";

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
    });

    if (isContestant) {
      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: false,
      });
    } else if (isAdmin) {
      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: false,
        canSubscribe: true,
        roomAdmin: true,
      });
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const token = await at.toJwt();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating token", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
