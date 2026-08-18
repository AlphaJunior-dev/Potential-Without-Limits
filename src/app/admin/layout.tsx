"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, ArrowLeft, ShieldAlert, Users, Building2, Sparkles } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userStatus, loading } = useAuth();
  const authorized = pathname === "/admin/login" || userStatus === "admin";

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (loading) return;

    if (userStatus !== "admin") {
      if (userStatus === "pending") {
        router.push("/pending");
      } else {
        router.push("/admin/login");
      }
    }
  }, [userStatus, loading, router, pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#FDFCF9] flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#005C27] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#051836]/60 font-medium">Verifying admin credentials...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="h-screen bg-[#FDFCF9] flex items-center justify-center p-4 font-inter">
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-md border border-[#051836]/10 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-montserrat font-bold text-xl text-[#051836] mb-2">
            Access Denied
          </h2>
          <p className="text-xs text-[#051836]/70 mb-6 leading-relaxed">
            You do not have administrator permissions to access the PWLIF Admin Portal.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/admin/login"
              className="bg-[#005C27] text-white px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-[#327B2F] transition inline-flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-[#F5AB00]" />
              <span>Admin Login Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-[#FDFCF9]">{children}</div>;
}
