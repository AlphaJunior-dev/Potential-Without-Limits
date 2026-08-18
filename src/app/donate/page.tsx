import { redirect } from "next/navigation";

export default function LegacyDonationRedirect() {
  redirect("/orientation");
}
