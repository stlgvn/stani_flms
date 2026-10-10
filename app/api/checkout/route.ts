import { NextResponse, type NextRequest } from "next/server";
import { findPack } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

// The "Buy" button posts here; we create a Stripe Checkout page and send the user to it.
export async function POST(request: NextRequest) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", site), { status: 303 });

  const form = await request.formData();
  const pack = findPack(String(form.get("pack") ?? ""));
  if (!pack) return NextResponse.json({ error: "Unknown pack" }, { status: 400 });

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: pack.priceCents,
            product_data: { name: `${pack.name} — ${pack.credits} video credits` },
          },
        },
      ],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { user_id: user.id, pack: pack.id, credits: String(pack.credits) },
      success_url: `${site}/dashboard?paid=1`,
      cancel_url: `${site}/dashboard`,
    });
    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.redirect(new URL("/dashboard?payment_error=1", site), { status: 303 });
  }
}
