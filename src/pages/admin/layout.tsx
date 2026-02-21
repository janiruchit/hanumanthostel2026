import { ReactNode } from "react";
import { AdminSidebar } from "@/components/ui/navigation";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <main className="p-4 sm:p-8 max-w-7xl mx-auto pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
