import { Button } from '../ui/button';
import { InputWithLabel } from '../ui/components/InputWithLabel/InputWithLabel';

export default function Page() {
  return (
    <div className="mt-2 flex w-full flex-col items-center justify-center">
      <div className="self-start px-9 text-3xl font-bold">Registrarme</div>
      <section className=" flex w-full flex-col md:flex-row md:justify-evenly">
        <div className="w-full md:w-[40%]">
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
            name="dni"
            type="dni"
            placeHolder="123456789"
          />
        </div>
        <div className="w-full md:w-[40%]">
          <InputWithLabel
            label="Fecha de nacimiento"
            name="date"
            type="date"
            placeHolder="18/08/1995"
          />
          <InputWithLabel label="Contraseña" name="password" type="password" />
          <InputWithLabel
            label=" Confirmar Contraseña"
            name="other-password"
            type="password"
          />
          <InputWithLabel label="Foto" name="foto" type="file" />
          <InputWithLabel
            label="Sexo"
            name="date"
            type="date"
            placeHolder="18/08/1995"
          />
          <InputWithLabel
            label="Socio"
            name="socio"
            type="checkbox"
            stylesInput="peer block rounded-md h-[37px] border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          />
          <div className="mt-9 flex w-full justify-end">
            <Button className={`bg-blue-400 font-bold`}>REGISTRARME</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
