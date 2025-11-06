'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth-provider';
import { Badge } from '@/components/ui/badge';
import { Logo } from './icons';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

export function MobileHeader() {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Menu Button and Logo */}
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-semibold text-base sm:text-lg tracking-tight">DoctorAtHome</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2">
          {user.role === 'doctor' && (
            <Badge 
              variant={user.isOnline ? 'default' : 'secondary'} 
              className="text-xs hidden sm:inline-flex"
            >
              {user.isOnline ? 'En línea' : 'Offline'}
            </Badge>
          )}
          <Avatar className="h-8 w-8 ring-2 ring-background">
            <AvatarImage src={user.profilePictureURL} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

