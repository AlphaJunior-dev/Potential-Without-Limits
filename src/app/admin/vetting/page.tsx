import { redirect } from "next/navigation";

export default function LegacyVettingRedirect() {
  redirect("/admin");
}
