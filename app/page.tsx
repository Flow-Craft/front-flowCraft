import MenuPrincipal from './ui/menuPrincipal/menuPrincipal';

const LOGIN_HREF = "/login"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-2">
      <MenuPrincipal/>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        ACA VAN A IR NOTICIAS PERO POR EL MOMENTO FLOWCRAFT EL QUE LEE
      </div>
    </main>
  );
}
