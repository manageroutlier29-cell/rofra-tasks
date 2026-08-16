import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'rofra-secret-key-123456');

// Sample question pool (Can be extended or loaded from Prisma Assessment model)
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary rule when labeling bounding boxes for Object Detection tasks?",
    options: [
      "Include as much background surrounding the object as possible",
      "Draw tight boxes around the complete target object without excluding parts",
      "Only draw boxes around half of the visible object",
      "Ignore obscured or partially occluded objects"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "When evaluating RLHF (Reinforcement Learning from Human Feedback) prompts, which criteria takes highest priority?",
    options: [
      "Response length and vocabulary complexity",
      "Factuality, safety, and helpfulness without harmful hallucinations",
      "Use of emojis and conversational humor",
      "Speed of response generation"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "If a task guideline is ambiguous or missing a specific rule, what is the correct protocol?",
    options: [
      "Guess the rule based on personal preference",
      "Skip all ambiguous tasks permanently",
      "Flag the task for clarification via Admin support while documenting edge cases",
      "Complete the task with arbitrary labels"
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "What constitutes a data confidentiality violation on ROFRA?",
    options: [
      "Working on tasks during weekend hours",
      "Sharing task instructions, datasets, or customer prompt contents with external parties",
      "Asking admins for help on task guidelines",
      "Submitting more than 10 tasks in a single day"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "How are task payouts calculated on ROFRA?",
    options: [
      "Based on hours logged regardless of quality",
      "Flat rate per month",
      "Per verified and approved task completion meeting accuracy benchmarks",
      "Random lottery distribution"
    ],
    correctAnswer: 2
  }
];

export async function GET() {
  // Omit correctAnswer from payload sent to client to prevent cheating
  const sanitizedQuestions = ASSESSMENT_QUESTIONS.map(({ correctAnswer, ...q }) => q);
  return NextResponse.json({
    title: "General Work Quality & Safety Certification",
    passingScore: 80,
    questions: sanitizedQuestions
  });
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    const { answers } = await request.json(); // Map of { [questionId]: optionIndex }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid submission payload' }, { status: 400 });
    }

    let correctCount = 0;
    ASSESSMENT_QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / ASSESSMENT_QUESTIONS.length) * 100);
    const passed = scorePercentage >= 80;
    const newStatus = passed ? 'APPROVED' : 'PENDING_APPROVAL';

    // Update account status in PostgreSQL via Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    return NextResponse.json({
      score: scorePercentage,
      passed,
      status: updatedUser.status,
      message: passed 
        ? "Congratulations! You passed the assessment and your worker status is now APPROVED."
        : "Assessment complete. Your score is under review for manual admin approval."
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process assessment grading' }, { status: 500 });
  }
}
