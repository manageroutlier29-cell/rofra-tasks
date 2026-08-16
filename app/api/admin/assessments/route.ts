import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(assessments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, passingScore, totalQuestions } = body;

    const assessment = await prisma.assessment.create({
      data: {
        title,
        category,
        passingScore: Number(passingScore) || 80,
        totalQuestions: Number(totalQuestions) || 10,
      },
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}
