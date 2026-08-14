import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { phone, email } = await req.json();

    // Format phone number to standard 254XXXXXXXXX format
    let formattedPhone = phone.trim().replace('+', '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1);
    }

    const publicKey = process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY || '';
    const secretKey = process.env.INTASEND_SECRET_KEY || '';

    const response = await fetch('https://payment.intasend.com/api/v1/checkout/mpesa-express/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_key: publicKey,
        token: secretKey,
        amount: 250,
        phone_number: formattedPhone,
        email: email,
        api_ref: `PRO_UPGRADE_${Date.now()}`
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.detail || JSON.stringify(data) || 'Failed to trigger M-Pesa STK push.';
      return NextResponse.json({ error: errorMsg }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
