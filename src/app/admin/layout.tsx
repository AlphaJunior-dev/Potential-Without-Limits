import type { ReactNode } from "react";

/**
 * Administrator authorization is enforced by the server API routes. The
 * administrator page exchanges a Firebase ID token only for those routes;
 * this layout intentionally makes no browser-side role decision.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
