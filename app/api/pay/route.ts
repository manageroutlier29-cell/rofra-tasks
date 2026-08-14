import { NextResponse } from 'next/server';
import IntaSend from 'intasend-node';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Convert local numbers (07XX... / 01XX...) to 2547XX...
    let formattedPhone = phone.trim().replace(/\+/g, '').replace(/\s+/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }

    const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY || '';
    const secretKey = process.env.INTASEND_SECRET_KEY || '';
    const isTest = process.env.INTASEND_IS_TEST === 'true';

    if (!publishableKey || !secretKey) {
      return NextResponse.json(
        { error: 'IntaSend API keys missing from Environment Variables' },
        { status: 500 }
      );
    }

    // Initialize IntaSend SDK correctly
    const intasend = new IntaSend(publishableKey, {
      secretKey: secretKey,
      test: isTest,
    });

    const collection = intasend.collection();

    // Trigger M-Pesa STK Push
    const response = await collection.mpesaStkPush({
      first_name: 'ROFRA',
      last_name: 'User',
      email: 'user@rofratasks.com',
      amount: 250,
      phone_number: formattedPhone,
      api_ref: 'PRO_UPGRADE',
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error('IntaSend STK Push Error:', error);
    return NextResponse.json(
      { error: error?.message || 'STK Push failed to initiate' },
      { status: 500 }
    );
  }
}
