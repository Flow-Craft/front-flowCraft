'use client';
import { FlowTable } from '@/app/ui/components/FlowTable/FlowTable';
import { SelectWithLabel } from '@/app/ui/components/SelectWithLabel/SelectWithLabel';
import { getUsersAdmin } from '@/app/utils/actions';
import withAuthorization from '@/app/utils/autorization';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

function Page() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({})
  const getUsuariosParaBuscarEstadisticas = async() =>{
    const {usuarios} = await getUsersAdmin();
    const usuariosValue = usuarios.map((usr)=>({value:usr.id, label:`${usr.dni} - ${usr.apellido} ${usr.nombre}`}))
    setUsuarios([{value:0,label:"Yo mismo"}, ...usuariosValue])
  }

  const handleChangeUsuario = (e) =>{
    if(e.value){

    }else{

    }
  }
  
  useEffect(() => {
    getUsuariosParaBuscarEstadisticas();
  }, [])
  
  return (
    <section>
      <Toaster />
      <div className="mt-6 self-start px-9 pb-9 text-3xl font-bold">
        Estadisticas
      </div>
      <div className="ml-8 flex flex-row items-center gap-3">
        <div className='min-w-[500px]'>
          <SelectWithLabel
            label="Seleccionar el jugador a visualizar"
            options={usuarios}
            value={usuarioSeleccionado}
            onChange={(e)=>{
              setUsuarioSeleccionado(e)
              handleChangeUsuario(e)
            }}
          />
        </div>
      </div>
      <section>
        <FlowTable Header={[]} dataToShow={[]} />
      </section>
    </section>
  );
}

export default withAuthorization(Page, 'Estadisticas');
