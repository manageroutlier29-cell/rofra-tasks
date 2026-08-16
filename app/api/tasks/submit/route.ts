import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'rofra-secret-key-123456');

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.id as string;

    const { taskId, submissionContent } = await request.json();

    if (!submissionContent || submissionContent.trim().length === 0) {
      return NextResponse.json({ error: 'Submission content cannot be empty' }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task || task.assignedToId !== userId) {
      return NextResponse.json({ error: 'Task not found or not assigned to you' }, { status: 403 });
    }

    const submittedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'SUBMITTED',
        submissionContent,
      },
    });

    return NextResponse.json({ success: true, task: submittedTask });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit work' }, { status: 500 });
  }
}
