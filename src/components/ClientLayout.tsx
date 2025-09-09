// src/components/ClientLayout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderMenuButton,
  HeaderNavigation,
  HeaderMenuItem,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkipToContent,
  Content,
  HeaderPanel,
} from '@carbon/react';
import { Grid, Column } from '@carbon/react';
import { Moon, Sun, Menu } from '@carbon/icons-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LangToggle } from '@/components/LangToggle';
import { CalendarToggle } from '@/components/CalendarToggle';
import { useTheme } from '@/contexts/ThemeContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();

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
          aria-label="Open menu"
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
          {/* Theme indicator (toggle itself is in the page controls) */}
          <HeaderGlobalAction aria-label="Theme">
            {theme === 'g90' ? <Moon /> : <Sun />}
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <SideNav expanded={expanded} aria-label="Side navigation">
        <SideNavItems>
          {navItems.map((item) => (
            <SideNavLink
              key={item.href}
              element={Link as unknown as React.ElementType}
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
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end',
                marginBottom: '1rem',
              }}
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
