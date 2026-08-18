"use client";

import { FormEvent, useState } from "react";
import {
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { app } from "@/lib/firebase";

type AdminData = {
  site: {
    heroTitle?: string;
    heroText?: string;
    bookingUrl?: string;
  };
  applications: Array<{
    id: string;
    fullName?: string;
    email?: string;
    organization?: string;
    status?: string;
  }>;
};

export default function AdminPage() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [saving, setSaving] = useState(false);

  async function token(currentUser: User | null = user) {
    return currentUser ? currentUser.getIdToken() : "";
  }

  async function load(currentUser: User | null = user) {
    const accessToken = await token(currentUser);
    const response = await fetch("/api/admin", {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.error || "Administrator access required.");
      setData(null);
      return;
    }

    setError("");
    setData(payload);
  }

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await setPersistence(auth, inMemoryPersistence);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const claims = await credential.user.getIdTokenResult(true);

      if (claims.claims.admin !== true) {
        await signOut(auth);
        throw new Error("This account is not an authorised PWLIF administrator.");
      }

      setUser(credential.user);
      await load(credential.user);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    }
  }

  async function saveSite(event: FormEvent) {
    event.preventDefault();
    if (!data) return;

    setSaving(true);
    const accessToken = await token();
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ action: "updateSite", ...data.site }),
    });
    setSaving(false);

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error || "Unable to save.");
      return;
    }

    await load();
  }

  async function updateApplicationStatus(applicationId: string, value: string) {
    const accessToken = await token();
    const response = await fetch("/api/admin", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        action: "updateApplicationStatus",
        applicationId,
        status: value,
      }),
    });

    if (!response.ok) {
      const payload = await response.json();
      setError(payload.error || "Unable to update.");
      return;
    }

    await load();
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#051836] px-5 py-20 text-white">
        <form
          onSubmit={login}
          className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/[.07] p-8"
        >
          <p className="text-xs font-black uppercase tracking-[.2em] text-[#F5AB00]">
            Internal workspace
          </p>
          <h1 className="mt-3 font-montserrat text-3xl font-black">Administrator sign in</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Only Firebase accounts with an approved server-side administrator claim can access this workspace.
          </p>
          <label className="mt-6 block text-sm font-bold">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl bg-white px-3 py-3 text-[#051836]"
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl bg-white px-3 py-3 text-[#051836]"
            />
          </label>
          {error && <p role="alert" className="mt-4 text-sm text-[#F5AB00]">{error}</p>}
          <button className="mt-6 rounded-xl bg-[#005C27] px-5 py-3 text-xs font-black uppercase tracking-wider">
            Sign in securely
          </button>
        </form>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-[#FDFCF9] px-5 py-20 text-center text-[#051836]">
        <p>{error || "Loading administrator workspace…"}</p>
        <button
          onClick={() => void signOut(auth).then(() => setUser(null))}
          className="mt-5 rounded-xl bg-[#051836] px-5 py-3 text-xs font-black uppercase tracking-wider text-white"
        >
          Sign out
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF9] px-5 py-10 text-[#051836] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#005C27]">Private workspace</p>
            <h1 className="mt-2 font-montserrat text-4xl font-black">PWLIF administration</h1>
          </div>
          <button
            onClick={() => void signOut(auth).then(() => setUser(null))}
            className="rounded-xl border border-[#051836]/15 px-4 py-2 text-xs font-black uppercase tracking-wider"
          >
            Sign out
          </button>
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(5,24,54,.06)]">
          <h2 className="font-montserrat text-2xl font-black">Public site settings</h2>
          <form onSubmit={saveSite} className="mt-5 grid gap-4">
            <label className="text-sm font-bold">
              Homepage title
              <input
                value={data.site.heroTitle || ""}
                onChange={(event) => setData({ ...data, site: { ...data.site, heroTitle: event.target.value } })}
                className="mt-1 w-full rounded-xl border border-[#051836]/15 p-3"
              />
            </label>
            <label className="text-sm font-bold">
              Homepage context
              <textarea
                rows={4}
                value={data.site.heroText || ""}
                onChange={(event) => setData({ ...data, site: { ...data.site, heroText: event.target.value } })}
                className="mt-1 w-full rounded-xl border border-[#051836]/15 p-3"
              />
            </label>
            <label className="text-sm font-bold">
              Calendly booking URL
              <input
                value={data.site.bookingUrl || ""}
                onChange={(event) => setData({ ...data, site: { ...data.site, bookingUrl: event.target.value } })}
                className="mt-1 w-full rounded-xl border border-[#051836]/15 p-3"
              />
            </label>
            <button
              disabled={saving}
              className="w-fit rounded-xl bg-[#005C27] px-5 py-3 text-xs font-black uppercase tracking-wider text-white"
            >
              {saving ? "Saving…" : "Save public settings"}
            </button>
          </form>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgba(5,24,54,.06)]">
          <h2 className="font-montserrat text-2xl font-black">Orientation inbox</h2>
          {data.applications.length === 0 ? (
            <p className="mt-4 text-sm text-[#051836]/65">No orientation requests yet.</p>
          ) : (
            <div className="mt-5 grid gap-3">
              {data.applications.map((application) => (
                <article key={application.id} className="rounded-2xl border border-[#051836]/10 p-4">
                  <p className="font-bold">{application.fullName || "Unnamed request"}</p>
                  <p className="mt-1 text-sm text-[#051836]/65">
                    {application.organization} · {application.email}
                  </p>
                  <label className="mt-3 block text-xs font-black uppercase tracking-wider">
                    Status
                    <select
                      value={application.status || "new"}
                      onChange={(event) => void updateApplicationStatus(application.id, event.target.value)}
                      className="ml-3 rounded-lg border border-[#051836]/15 p-2 text-sm normal-case tracking-normal"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="call_scheduled">Call scheduled</option>
                      <option value="approved">Approved</option>
                      <option value="declined">Declined</option>
                    </select>
                  </label>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
