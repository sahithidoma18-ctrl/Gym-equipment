import type { Metadata } from 'next';
import './globals.css';
import { EquipmentProvider } from '@/context/EquipmentContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'GymPulse | AI-Powered Gym Equipment Availability Checker',
  description:
    'Full-stack real-time gym equipment availability tracker with AI maintenance intelligence and dynamic utilization metrics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
        <EquipmentProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </EquipmentProvider>
      </body>
    </html>
  );
}
