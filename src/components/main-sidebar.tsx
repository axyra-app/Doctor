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
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="items-center justify-center gap-2 text-center group-data-[collapsible=icon]:hidden">
        <Logo className="h-8 w-8 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight text-primary">DoctorExpress</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
         <SidebarMenu>
           <SidebarMenuItem>
              <Link href="/profile">
                <SidebarMenuButton isActive={pathname === '/profile'} tooltip="Perfil">
                  <User />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
              <LogOut />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:hidden">
           <Avatar className="h-10 w-10">
              <AvatarImage src={user.profilePictureURL} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.firstName} {user.lastName}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
