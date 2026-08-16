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

    const { taskId } = await request.json();

    // Atomic update to lock task if still AVAILABLE
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'Task is already claimed by another worker' }, { status: 400 });
    }

    const claimedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: 'CLAIMED',
        assignedToId: userId,
      },
    });

    return NextResponse.json({ success: true, task: claimedTask });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to claim task' }, { status: 500 });
  }
}
