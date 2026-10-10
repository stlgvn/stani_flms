import Legal from "@/components/Legal";
import { SITE } from "@/lib/site";

export const metadata = { title: `Privacy Policy — ${SITE.name}` };

export default function Privacy() {
  return (
    <Legal title="Privacy Policy">
      <p className="text-muted">Last updated: {SITE.updated}</p>
      <h2>What we collect</h2>
      <ul>
        <li>Your email address — to sign you in and contact you about your account.</li>
        <li>The videos you upload and the processed results — only to provide the Service.</li>
        <li>Your credit balance and purchase history (amount, date, pack).</li>
        <li>Basic technical logs (IP address, browser) for security and troubleshooting.</li>
      </ul>
      <p>Card details are entered on Stripe’s page and never reach our servers.</p>
      <h2>How long we keep it</h2>
      <ul>
        <li>Uploaded and processed videos are deleted automatically 48 hours after processing.</li>
        <li>Account and payment records are kept while your account is active and as required for tax purposes.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        Only the providers that run the Service: hosting and database (Supabase), payments (Stripe) and email delivery.
        We do not sell your personal information.
      </p>
      <h2>Your rights</h2>
      <p>
        You can ask us to access, correct or delete your data at any time by emailing {SITE.email}. California
        residents have these rights under the CCPA; we do not sell or share personal information for advertising.
      </p>
      <h2>Contact</h2>
      <p>
        {SITE.company}, {SITE.address}. Email: {SITE.email}
      </p>
    </Legal>
  );
}
