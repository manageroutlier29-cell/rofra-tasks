import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'rofra-secret-key-123456');

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let userId = '';
    if (token) {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userId = payload.id as string;
    }

    const [availableTasks, claimedTasks] = await Promise.all([
      prisma.task.findMany({
        where: { status: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' },
      }),
      userId
        ? prisma.task.findMany({
            where: { assignedToId: userId },
            orderBy: { updatedAt: 'desc' },
          })
        : [],
    ]);

    return NextResponse.json({ availableTasks, claimedTasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
