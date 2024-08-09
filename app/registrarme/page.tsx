import { InputWithLabel } from '../ui/components/InputWithLabel/InputWithLabel';

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center">
      <div className="self-start px-9 text-3xl font-bold">Registrarme</div>
      <section className="flex-col">
        <div className="md:w-[100%]">
          <InputWithLabel
            label="Nombre"
            name="nombre"
            type="text"
            placeHolder="Pepe"
          />
          <InputWithLabel
            label="Apellido"
            name="apellido"
            type="text"
            placeHolder="Argento"
          />
          <InputWithLabel
            label="Telefono"
            name="telefono"
            type="number"
            placeHolder="2616738554"
          />
          <InputWithLabel
            label="Telefono"
            name="telefono"
            type="number"
            placeHolder="2616738554"
          />
          <InputWithLabel
            label="Direccion"
            name="direccion"
            type="string"
            placeHolder="Calle false 123"
          />
          <InputWithLabel
            label="MAIL"
            name="email"
            type="email"
            placeHolder="ejemplo@gmail.com"
          />
          <InputWithLabel
            label="DNI"
            name="email"
            type="email"
            placeHolder="ejemplo@gmail.com"
          />
        </div>
        <div></div>
      </section>
    </div>
  );
}
