'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAdmin } from '@/lib/admin';
import { Loading } from '@/components/Loading';
import { Emoji } from 'react-apple-emojis';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.email) {
      router.push('/');
      return;
    }

    const admin = isAdmin(session.user.email);
    if (!admin) {
      router.push('/');
      return;
    }

    setIsAuthorized(true);
    setChecking(false);
  }, [session, status, router]);

  if (status === 'loading' || checking) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'chart-bar' },
    { href: '/admin/problems', label: 'Problems', icon: 'laptop' },
    { href: '/admin/categories', label: 'Categories', icon: 'folder' },
    { href: '/admin/users', label: 'Users', icon: 'bust-in-silhouette' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-foreground/10 bg-background z-40">
        <div className="p-6 border-b border-foreground/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Emoji name="bat" className="w-6 h-6" />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-foreground text-background font-medium'
                    : 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                <Emoji name={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <Emoji name="left-arrow" className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

