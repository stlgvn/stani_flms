import Legal from "@/components/Legal";
import { SITE } from "@/lib/site";

export const metadata = { title: `Refund Policy — ${SITE.name}` };

export default function Refunds() {
  return (
    <Legal title="Refund Policy">
      <p className="text-muted">Last updated: {SITE.updated}</p>
      <ul>
        <li>Unused credit packs can be refunded in full within 14 days of purchase.</li>
        <li>Partially used packs are refunded for the unused credits, pro rata.</li>
        <li>If a video fails to process, the credit returns to your balance automatically.</li>
        <li>
          To request a refund, email {SITE.email} from your account email. Refunds go back to the original payment method
          within 5–10 business days.
        </li>
      </ul>
    </Legal>
  );
}
