"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        {/* Aquí puedes agregar elementos comunes del dashboard como sidebar, header, etc. */}
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  );
} 