import { NextResponse, type NextRequest } from "next/server";

const WEBHOOK_URL = process.env.JOSE_SIGNUP_WEBHOOK;
const SHARED_SECRET = process.env.JOSE_SIGNUP_SECRET;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").trim().toLowerCase();
    const source = (body?.source ?? "homepage").trim();
    const honeypot = (body?.hp ?? "").trim();

    // Silently accept obvious bots
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
    }

    if (!WEBHOOK_URL) {
      console.error("Missing JOSE_SIGNUP_WEBHOOK env variable.");
      return NextResponse.json({ ok: false, error: "Signup service unavailable." }, { status: 500 });
    }

    const payload = {
      email,
      source,
      secret: SHARED_SECRET,
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script endpoints can take a second, so allow a little more time.
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.ok === false) {
      const errMsg = data?.error ?? "Signup failed, please try again.";
      console.error("Signup webhook error:", errMsg);
      return NextResponse.json({ ok: false, error: errMsg }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Signup API error", error);
    return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });
  }
}

