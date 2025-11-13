"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition-colors ${
        isActive
          ? "text-indigo-600 font-semibold"
          : "text-gray-700 hover:text-indigo-600"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gray-900">HQ</div>
          <div className="flex gap-6">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/todos">Todos</NavLink>
            <NavLink href="/bills">Bills & Due Dates</NavLink>
            <NavLink href="/business">Business</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
