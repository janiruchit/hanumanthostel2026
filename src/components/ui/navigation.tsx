import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Utensils, 
  Bell, 
  Settings,
  Menu,
  X
} from "lucide-react";

export function AdminSidebar() {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/rent", label: "Rent & Fees", icon: CreditCard },
    { href: "/admin/menu", label: "Food Menu", icon: Utensils },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-primary text-primary-foreground rounded-lg shadow-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={cn(
        "w-64 bg-card h-screen fixed left-0 top-0 border-r border-border shadow-sm flex flex-col z-40 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary tracking-tight">Hanumant</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => logoutMutation.mutate()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}

export function StudentHeader() {
  const { user, logoutMutation } = useAuth();
  
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">Hanumant Hostel</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">Room {user?.roomNumber || "N/A"}</p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
