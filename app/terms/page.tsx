import Legal from "@/components/Legal";
import { SITE } from "@/lib/site";

export const metadata = { title: `Terms of Service — ${SITE.name}` };

export default function Terms() {
  return (
    <Legal title="Terms of Service">
      <p className="text-muted">Last updated: {SITE.updated}</p>
      <p>
        These terms govern your use of {SITE.name} (the “Service”), operated by {SITE.company} (“we”, “us”). By
        creating an account or using the Service you agree to them.
      </p>
      <h2>1. The Service</h2>
      <p>
        {SITE.name} creates modified versions of short videos you upload (re-framing, speed, pitch, color and
        re-encoding) and lets you download the result. Processed files are deleted from our servers 48 hours after
        processing.
      </p>
      <h2>2. Your content</h2>
      <ul>
        <li>You may only upload videos that you own or are licensed to modify and publish.</li>
        <li>
          You may not use the Service to infringe anyone’s copyright, trademark or other rights, or to remove or obscure
          another creator’s attribution.
        </li>
        <li>
          You keep all rights to your videos. You grant us only the limited permission needed to store and process them
          to provide the Service.
        </li>
        <li>We may suspend accounts that misuse the Service or receive valid infringement complaints.</li>
      </ul>
      <h2>3. Credits and payments</h2>
      <ul>
        <li>Processing one video uses one credit. New accounts receive 3 free credits.</li>
        <li>Credit packs are paid in advance through Stripe. Prices are shown in US dollars and include applicable fees.</li>
        <li>If processing fails, the credit is returned to your balance automatically.</li>
        <li>Refunds are covered by our <a className="text-accent underline" href="/refunds">Refund Policy</a>.</li>
      </ul>
      <h2>4. No guarantees about third-party platforms</h2>
      <p>
        We do not control Instagram, YouTube, TikTok or any other platform and make no promise about how their systems
        will treat videos processed with the Service.
      </p>
      <h2>5. Disclaimer and liability</h2>
      <p>
        The Service is provided “as is”. To the maximum extent permitted by law, our total liability for any claim is
        limited to the amount you paid us in the 12 months before the claim.
      </p>
      <h2>6. Changes</h2>
      <p>We may update these terms; the date above shows the latest version. Continued use means you accept them.</p>
      <h2>7. Contact</h2>
      <p>
        {SITE.company}, {SITE.address}. Email: {SITE.email}
      </p>
    </Legal>
  );
}
