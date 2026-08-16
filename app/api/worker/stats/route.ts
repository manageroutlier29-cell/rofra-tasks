import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    // Read auth token or session ID from cookies/headers
    const cookieStore = cookies();
    const token = cookieStore.get('next-auth.session-token')?.value || cookieStore.get('sb-access-token')?.value;

    // If no active session token is present, return empty onboarding status
    if (!token) {
      return NextResponse.json({
        workerStatus: 'ONBOARDING',
        activeTasksCount: 0,
        lifetimeEarnings: 0,
        qualityRating: 'N/A',
        submissions: [],
      });
    }

    // Query DB for the specific authenticated session
    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: {
        user: {
          include: {
            submissions: true,
          },
        },
      },
    });

    const user = session?.user;

    if (!user) {
      return NextResponse.json({
        workerStatus: 'ONBOARDING',
        activeTasksCount: 0,
        lifetimeEarnings: 0,
        qualityRating: 'N/A',
        submissions: [],
      });
    }

    const approvedSubmissions = user.submissions.filter((s) => s.status === 'APPROVED');
    const totalEarnings = approvedSubmissions.reduce((sum, s) => sum + (s.rewardAmount || 0), 0);
    const activeTasks = user.submissions.filter((s) => s.status === 'PENDING').length;

    return NextResponse.json({
      workerStatus: user.status || 'ONBOARDING',
      activeTasksCount: activeTasks,
      lifetimeEarnings: totalEarnings,
      qualityRating: '100%',
      submissions: user.submissions.slice(0, 5),
    });
  } catch (error) {
    return NextResponse.json(
      {
        workerStatus: 'ONBOARDING',
        activeTasksCount: 0,
        lifetimeEarnings: 0,
        qualityRating: 'N/A',
        submissions: [],
      },
      { status: 200 }
    );
  }
}
