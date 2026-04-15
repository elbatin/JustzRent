import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Car, CalendarCheck, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")

  if (!session?.value) {
    redirect("/admin/login")
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/vehicles", label: "Vehicles", icon: Car },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-card border-r border-border/50 flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-border/50">
          <Link href="/admin" className="font-bold text-lg">
            Justz<span className="text-primary">Rent</span>
            <span className="block text-xs text-muted-foreground font-normal mt-0.5">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-border/50 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            View Site
          </Link>
          <form
            action={async () => {
              "use server"
              const { cookies } = await import("next/headers")
              const cookieStore = await cookies()
              cookieStore.delete("admin_session")
              redirect("/admin/login")
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border/50 bg-background flex items-center justify-between px-6">
          <h2 className="text-sm font-medium text-muted-foreground">Management Console</h2>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}