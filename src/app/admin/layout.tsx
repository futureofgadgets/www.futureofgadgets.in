"use client";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Search,
  User,
  Home,
  Settings,
  UserSquare,
  SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/admin", icon: Home, label: "Dashboard" },
  // { href: "/admin/dashboard", icon: BarChart3, label: "Admin Panel" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/settings", icon: SettingsIcon, label: "Settings" },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      <div className="min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between gap-2 sm:gap-4 border-b bg-white px-2 sm:px-4 min-w-0">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Store logo"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded bg-transparent"
              />
              <div>
                <h1 className="text-sm sm:text-base font-bold text-gray-900">Future Of Gadgets</h1>
                <p className="text-[10px] sm:text-xs text-gray-500">Admin Panel</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer flex-shrink-0">
                <Button
                  variant="ghost"
                  className="relative p-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-transparent hover:border-blue-200 transition-all duration-200"
                >
                  {status === "loading" ? (
                    <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    </div>
                  ) : session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {session?.user?.name?.charAt(0).toUpperCase() || "A"}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {session && (
                  <>
                    <div className="p-2">
                      <p className="font-medium text-sm truncate">
                        {session.user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/">Main Site</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="pt-16 pb-16 md:pb-0">{children}</div>
        
        {/* Bottom Nav for Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
          <div className="flex justify-around items-center h-14">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 h-full ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] mt-0.5">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
