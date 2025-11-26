import React, { useState } from 'react';
import { HomeIcon } from '@/components/components/ui/home';
import { UserIcon } from '@/components/components/ui/user';
import { FeatherIcon } from '@/components/components/ui/feather';

function NavItem({ href, label, icon: Icon, isActive }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors ${
        isActive
          ? 'bg-neutral-200 dark:bg-neutral-800 font-medium'
          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon size={20} isAnimating={isHovered} />
      {label}
    </a>
  );
}

export default function Sidebar({ currentPath }) {
  const isActive = (path) => currentPath === path;

  const navItems = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/blog', label: 'Writing', icon: FeatherIcon },
    { href: '/about', label: 'About', icon: UserIcon },
  ];

  return (
    <aside className="w-64 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 h-screen overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-neutral-100"></div>
          <h1 className="font-bold text-sm">Yasin Kavakli</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <NavItem
            key={href}
            href={href}
            label={label}
            icon={Icon}
            isActive={isActive(href)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-500">
        © 2025 Yasin Kavakli
      </div>
    </aside>
  );
}
