import MenuPrincipal from '@/app/ui/menuPrincipal/menuPrincipal';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <MenuPrincipal />
      <div>{children}</div>
    </main>
  );
}
