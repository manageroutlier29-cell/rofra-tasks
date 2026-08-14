import { NextResponse } from 'next/server';
import IntaSend from 'intasend-node';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY || '';
    const secretKey = process.env.INTASEND_SECRET_KEY || '';
    const isTest = process.env.INTASEND_IS_TEST === 'true';

    const intasend = new IntaSend(publishableKey, secretKey, isTest);
    const collection = intasend.collection();

    // Trigger IntaSend STK Push
    const response = await collection.mpesaStkPush({
      first_name: 'Customer',
      last_name: 'User',
      email: 'user@example.com',
      amount: 250,
      phone_number: phone,
      api_ref: 'PRO_UPGRADE',
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'STK Push failed to initiate' },
      { status: 500 }
    );
  }
}
