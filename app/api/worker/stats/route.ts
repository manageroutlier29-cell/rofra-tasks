import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // or your prisma client import path

export async function GET(request: Request) {
  try {
    // Replace with your auth session user check (e.g., NextAuth / Supabase / Clerk)
    // For demo/DB link, fetching default or authenticated worker record
    const user = await prisma.user.findFirst({
      include: {
        submissions: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        workerStatus: 'ONBOARDING',
        activeTasksCount: 0,
        lifetimeEarnings: 0,
        qualityRating: '100%',
        submissions: [],
      });
    }

    const approvedSubmissions = user.submissions.filter((s) => s.status === 'APPROVED');
    const totalEarnings = approvedSubmissions.reduce((sum, s) => sum + (s.rewardAmount || 0), 0);
    const activeTasks = user.submissions.filter((s) => s.status === 'PENDING').length;

    return NextResponse.json({
      workerStatus: user.role === 'APPROVED_WORKER' ? 'APPROVED' : user.status || 'PENDING_ASSESSMENT',
      activeTasksCount: activeTasks,
      lifetimeEarnings: totalEarnings,
      qualityRating: '100%',
      submissions: user.submissions.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json(
      {
        workerStatus: 'PENDING_ASSESSMENT',
        activeTasksCount: 0,
        lifetimeEarnings: 0,
        qualityRating: 'N/A',
        submissions: [],
      },
      { status: 200 }
    );
  }
}
