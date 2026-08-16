import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { workerEmail, score, answers } = await req.json();

    if (!workerEmail) {
      return NextResponse.json({ error: 'Worker email is required' }, { status: 400 });
    }

    const submission = await prisma.assessmentSubmission.create({
      data: {
        workerEmail,
        score: score || 0,
        answers: answers || {},
        status: score >= 80 ? 'passed' : 'pending_review',
      },
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
