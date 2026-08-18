import { redirect } from "next/navigation";

/**
 * The former talent page edited only transient browser state. Talent-related
 * administration is now handled by the protected main dashboard.
 */
export default function LegacyTalentRedirect() {
  redirect("/admin");
}
