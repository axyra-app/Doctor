'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  LogOut,
  User,
  HeartPulse,
  Send,
  Stethoscope,
  List,
  Sparkles
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth-provider';
import type { UserProfile } from '@/types';
import { Logo } from './icons';
import { useAuth as useFirebaseAuth } from '@/firebase';

interface MainSidebarProps {
  user: UserProfile;
}

const patientNav = [
  { href: '/dashboard', label: 'Panel de Control', icon: LayoutDashboard },
  { href: '/requests/new', label: 'Nueva Solicitud', icon: Send },
  { href: '/requests', label: 'Mis Solicitudes', icon: List },
  { href: '/suggest-doctors', label: 'Sugerir Doctores', icon: Sparkles },
];

const doctorNav = [
  { href: '/dashboard', label: 'Panel de Control', icon: LayoutDashboard },
  { href: '/appointments', label: 'Solicitudes Cercanas', icon: HeartPulse },
  { href: '/appointments/history', label: 'Mis Atenciones', icon: Stethoscope },
];

export function MainSidebar({ user }: MainSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const firebaseAuth = useFirebaseAuth();
  const navItems = user.role === 'doctor' ? doctorNav : patientNav;

  const handleLogout = async () => {
    await firebaseAuth.signOut();
    // The logout from the provider will clear local state, and the router push will redirect.
    await logout();
    router.push('/login');
  };
  
  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Logo className="h-7 w-7 text-primary flex-shrink-0" />
          <div className="flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
            <h2 className="text-base font-semibold tracking-tight text-foreground">DoctorAtHome</h2>
            <span className="text-xs text-muted-foreground">
              {user.role === 'doctor' ? 'Doctor' : 'Paciente'}
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="space-y-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="w-full">
                <SidebarMenuButton
                  isActive={pathname === item.href || pathname.startsWith(item.href + '/')}
                  tooltip={item.label}
                  className="w-full justify-start gap-3 px-3 py-2.5"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-2 space-y-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/profile" className="w-full">
              <SidebarMenuButton 
                isActive={pathname === '/profile'} 
                tooltip="Perfil"
                className="w-full justify-start gap-3 px-3 py-2.5"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Perfil</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              tooltip="Cerrar Sesión"
              className="w-full justify-start gap-3 px-3 py-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted/50 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <Avatar className="h-9 w-9 ring-2 ring-background">
            <AvatarImage src={user.profilePictureURL} alt={`${user.firstName} ${user.lastName}`} />
            <AvatarFallback className="text-xs font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold truncate">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
            {user.role === 'doctor' && user.isOnline !== undefined && (
              <span className="text-xs mt-1">
                <Badge variant={user.isOnline ? 'default' : 'secondary'} className="text-xs">
                  {user.isOnline ? 'En línea' : 'Offline'}
                </Badge>
              </span>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
