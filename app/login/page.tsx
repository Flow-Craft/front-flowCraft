import LoginForm from '../ui/login-form';

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center">
      <div className="self-start px-9 text-3xl font-bold">¡BIENVENIDO!</div>
      <div className=" w-[80%] md:w-[40%]">
        <LoginForm />
      </div>
    </div>
  );
}
