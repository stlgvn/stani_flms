import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe calls this after a payment. The signature check proves the request really came from Stripe.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object;
    const userId = s.metadata?.user_id;
    const credits = Number(s.metadata?.credits);
    if (s.payment_status === "paid" && userId && credits > 0) {
      const { error } = await createAdminClient().rpc("grant_credits", {
        p_session_id: s.id,
        p_user: userId,
        p_pack: s.metadata?.pack ?? "",
        p_credits: credits,
        p_amount_cents: s.amount_total ?? 0,
        p_currency: s.currency ?? "usd",
      });
      // A 500 makes Stripe retry later, so a temporary database hiccup doesn't lose the payment.
      if (error) {
        console.error("grant_credits failed:", error.message);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ received: true });
}
