// src/components/ClientLayout.tsx
'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction,
  HeaderMenuButton, HeaderNavigation, HeaderMenuItem,
  SideNav, SideNavItems, SideNavLink, SkipToContent, Content
} from '@carbon/react';
import { Grid, Column } from '@carbon/react';
import { Moon, Sun } from '@carbon/icons-react';
import { useState, ComponentType, ReactNode, MouseEventHandler } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { CalendarToggle } from '@/components/CalendarToggle';
import { useTheme } from '@/contexts/ThemeContext';

type CarbonLinkProps = {
  href?: string;
  className?: string;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};
const LinkComponent = Link as unknown as ComponentType<CarbonLinkProps>;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();   // 'g10' | 'g90'
  const isDark = theme === 'g90';

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/citizen/grievances', label: 'Citizen • Grievances' },
    { href: '/citizen/grievances/new', label: 'Citizen • Submit' },
    { href: '/admin/triage', label: 'Admin • Triage' },
    { href: '/admin/grievances', label: 'Admin • All' },
    { href: '/admin/categories', label: 'Admin • Categories' },
    { href: '/admin/wards', label: 'Admin • Wards' },
  ];

  return (
    <>
      <SkipToContent />
      <Header aria-label="Gunaso System">
        <HeaderMenuButton
          aria-label={expanded ? 'Close menu' : 'Open menu'}
          isActive={expanded}
          onClick={() => setExpanded((v) => !v)}
        />
        <HeaderName href="/" prefix="Gunaso">
          System
        </HeaderName>

        <HeaderNavigation aria-label="Top nav">
          {navItems.slice(0, 3).map((item) => (
            <HeaderMenuItem
              key={item.href}
              isCurrentPage={pathname === item.href}
              href={item.href}
            >
              {item.label}
            </HeaderMenuItem>
          ))}
        </HeaderNavigation>

        <HeaderGlobalBar>
          {/* Icon reflects current theme and toggles on click */}
          <HeaderGlobalAction
            aria-label={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
            title={isDark ? 'Dark (click for Light)' : 'Light (click for Dark)'}
            onClick={toggleTheme}
          >
            {isDark ? <Moon /> : <Sun />}
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <SideNav expanded={expanded} aria-label="Side navigation">
        <SideNavItems>
          {navItems.map((item) => (
            <SideNavLink
              key={item.href}
              element={LinkComponent}
              href={item.href}
              isActive={pathname === item.href}
            >
              {item.label}
            </SideNavLink>
          ))}
        </SideNavItems>
      </SideNav>

      <Content id="main-content">
        <Grid narrow style={{ padding: '1rem' }}>
          <Column sm={4} md={8} lg={16}>
            <div
              aria-live="polite"
              className="shell-controls"
              style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '1rem' }}
            >
              <ThemeToggle />
              <LangToggle />
              <CalendarToggle />
            </div>
            {children}
          </Column>
        </Grid>
      </Content>
    </>
  );
}
