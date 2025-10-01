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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-3 p-2">
             <img
              src="/logo.png"
              alt="Store logo"
              className="h-10 w-10 rounded bg-transparent"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Electronic</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.label}
                        isActive={isActive}
                      >
                        <Link
                          href={item.href}
                          className={
                            isActive ? "!bg-blue-50 border border-blue-300 !text-blue-600 !h-10" : "!h-10"
                          }
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>


              {/* <SidebarMenuButton> */}
              <div className="py-4 flex items-center gap-2 px-2 bg-blue-50 rounded-sm">
                  <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointer">
                  <Button
                    variant="ghost"
                    className="relative p-0 h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-200 transition-all duration-200"
                  >
                    {status === "loading" ? (
                      <div className="h-9 w-12 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    ) : session?.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">
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
                        <p className="font-medium text-sm">
                          {session.user?.name || "Admin"}
                        </p>
                        <p className="text-xs text-muted-foreground">
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

              <div className="">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-black">{session?.user?.name || 'Admin'}</div>
                  <div className="text-xs text-gray-900">{session?.user?.email}</div>
                </div>
              </div>
              </div>
            
              {/* </SidebarMenuButton> */}
              {/* <SidebarMenuButton tooltip="Sign Out" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </SidebarMenuButton> */}

          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-3">
            <div className="flex items-center relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(
                      `/admin/search?q=${encodeURIComponent(
                        searchQuery.trim()
                      )}`
                    );
                  }
                }}
                className="flex items-center relative w-50 sm:w-full"
              >
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search admin panel..."
                  className="w-80 pr-10"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 h-7 w-7 p-0 z-20"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="relative p-0 h-10 w-10 rounded-full border-2 border-transparent hover:border-blue-200 transition-all duration-200"
                >
                  {status === "loading" ? (
                    <div className="h-9 w-12 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  ) : session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-sm font-semibold text-white">
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
                      <p className="font-medium text-sm">
                        {session.user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-muted-foreground">
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
        <div className="">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
