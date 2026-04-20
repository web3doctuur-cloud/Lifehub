import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all diary entries for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all diary entries for this user, ordered by most recent first
    const entries = await prisma.diaryEntry.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching diary entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create a new diary entry
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, mood } = await request.json();

    if (!content || !mood) {
      return NextResponse.json({ error: "Content and mood are required" }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new diary entry
    const entry = await prisma.diaryEntry.create({
      data: {
        content,
        mood,
        userId: user.id,
        date: new Date()
      }
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating diary entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete a diary entry (optional feature)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get("id");

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    // Verify the entry belongs to the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const entry = await prisma.diaryEntry.findFirst({
      where: { id: entryId, userId: user.id }
    });

    if (!entry) {
      return NextResponse.json({ error: "Entry not found or unauthorized" }, { status: 404 });
    }

    // Delete the entry
    await prisma.diaryEntry.delete({
      where: { id: entryId }
    });

    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}