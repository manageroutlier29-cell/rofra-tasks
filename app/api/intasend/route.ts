import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, email } = await req.json();

    const publishableKey = process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY || 'ISPubKey_live_xxxx';

    const response = await fetch('https://payment.intasend.com/api/v1/checkout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_key: publishableKey,
        amount: 250,
        currency: 'KES',
        email: email,
        phone_number: phone,
        api_ref: `PRO_UPGRADE_${Date.now()}`
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
