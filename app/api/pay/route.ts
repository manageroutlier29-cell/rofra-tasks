import { NextResponse } from 'next/server';

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

    const baseUrl = isTest 
      ? 'https://sandbox.intasend.com/api/v1/payment/mpesa-stk-push/' 
      : 'https://payment.intasend.com/api/v1/payment/mpesa-stk-push/';

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-IntaSend-Public-API-Key': publishableKey,
      },
      body: JSON.stringify({
        amount: 250,
        phone_number: formattedPhone,
        api_ref: 'PRO_UPGRADE',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.detail || data?.message || 'STK Push failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Network error initiating STK Push' },
      { status: 500 }
    );
  }
}
