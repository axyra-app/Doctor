
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';
import { AuthProvider } from '@/hooks/use-auth-provider';

export const metadata: Metadata = {
  title: {
    default: 'DoctorAtHome - Atención Médica a Domicilio',
    template: '%s | DoctorAtHome',
  },
  description: 'Plataforma de atención médica a domicilio. Conecta con doctores certificados en tiempo real. Atención médica profesional cuando y donde la necesites.',
  keywords: [
    'atención médica a domicilio',
    'doctor a domicilio',
    'médico a domicilio',
    'consulta médica en casa',
    'servicio médico a domicilio',
    'plataforma médica',
    'telemedicina',
    'salud a domicilio',
    'médico certificado',
    'atención médica urgente',
  ],
  authors: [{ name: 'DoctorAtHome' }],
  creator: 'DoctorAtHome',
  publisher: 'DoctorAtHome',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://doctorathome.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: 'DoctorAtHome - Atención Médica a Domicilio',
    description: 'Plataforma de atención médica a domicilio. Conecta con doctores certificados en tiempo real.',
    siteName: 'DoctorAtHome',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DoctorAtHome - Atención Médica a Domicilio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoctorAtHome - Atención Médica a Domicilio',
    description: 'Plataforma de atención médica a domicilio. Conecta con doctores certificados en tiempo real.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="theme-color" content="#3498DB" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
