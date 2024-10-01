'use client';

import FlowCraftAPI from './request';
import toast from 'react-hot-toast';
import { AUTORIZATION_KEY, LOCAL_STORAGE_NAME_KEY } from './const';
import {
  loginUserSchema,
  RegistryUserSchemaZod,
  verifyEmail,
  verifyEmailCode,
  verifyPasswords,
  UpdateUserSchemaZod,
  RegistryUserByAdminSchemaZod,
  CreatePerfilSchema,
} from './models/user';
import {
  editCreateNewSchema,
  editNewSchema,
  editWithoutFotoNewSchema,
} from './models/news';
import { tipoAcrearSchema, tipoAccionPartidoSchema } from './models/tipos';
import { crearInstalacionSchema } from './models/instalaciones';
import {
  formatDateToISOString,
  handleFileConversion,
  parseDateWithOutTime,
} from './manageFile';

export async function loginUser(formData: any) {
  try {
    const { Email, Contrasena } = loginUserSchema.parse({
      Email: formData.email,
      Contrasena: formData.password,
    });
    const response: any = await FlowCraftAPI.post(
      'Users/Login',
      {
        Email,
        Contrasena,
        ReaceptarTyC: formData.ReaceptarTyC,
      },
      false,
      false,
    );
    return response;
  } catch (error: any) {
    toast.error(error.message);
    if (
      error.message === 'Usuario debe aceptar los nuevos términos y condiciones'
    ) {
      return { aceptarNuevaMenteTyC: true };
    }
  }
}

export async function checkJWT() {
  try {
    const token = window.localStorage.getItem(AUTORIZATION_KEY);
    if (!token) {
      window.location.href = '/';
    }
    await FlowCraftAPI.get('Users/ComprobarJWT');
    return;
  } catch (error: any) {
    if (error.status === 401) {
      window.localStorage.clear();
      window.location.href = '/';
    }
  }
}

export async function checkJWTSession() {
  try {
    const token = window.localStorage.getItem(AUTORIZATION_KEY);
    if (token) {
      await FlowCraftAPI.get('Users/ComprobarJWT');
      // window.location.href = '/inicio/noticias';
    }

    return;
  } catch (error: any) {
    if (error.status === 401) {
      window.localStorage.clear();
    }
  }
}

export async function registryUser(RegistryUserSchema: any) {
  try {
    const result = RegistryUserSchemaZod.safeParse(RegistryUserSchema);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    const { data: user } = result;
    const fileType = user.FotoPerfilNo64.type;
    const finalUserToSend = JSON.parse(JSON.stringify(user));
    //convertir File to base 64
    let file64 = await handleFileConversion(
      new File([user.FotoPerfilNo64], user.FotoPerfilNo64.name, {
        type: user.FotoPerfilNo64.type,
      }),
    );
    finalUserToSend.FotoPerfil = file64;
    finalUserToSend.type = fileType;
    finalUserToSend.FechaNacimiento = parseDateWithOutTime(
      user.FechaNacimiento,
    );
    delete finalUserToSend.FotoPerfilNo64;
    delete finalUserToSend.OtraContrasena;
    toast.loading('Loading...');
    await FlowCraftAPI.post('Users/Registro', finalUserToSend);
    toast.dismiss();
    toast.success(
      'Usuario Creado con exito. Sera redirigido a la pantalla de login',
    );
    await createTimer(2000);
    window.location.href = '/login';
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export const bloquearUsuarioAdmin = async (id: string, razon: string) => {
  try {
    await FlowCraftAPI.post('Users/BloquearUsuario', { Id: id, Razon: razon });
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const desbloquearUsuarioAdmin = async (id: string, razon: string) => {
  try {
    await FlowCraftAPI.post('Users/DesbloquearUsuario', {
      Id: id,
      Razon: razon,
    });
  } catch (error: any) {
    toast.error(error.message);
  }
};

export async function verifyRegistryUser(RegistryUserSchema: any) {
  try {
    const result = RegistryUserSchemaZod.safeParse(RegistryUserSchema);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function verifyRegistryUserByAdmin(RegistryUserSchema: any) {
  try {
    const result = RegistryUserByAdminSchemaZod.safeParse(RegistryUserSchema);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    return result;
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function registrarUsuarioAdmin(userToCreate: any) {
  try {
    const fileType = userToCreate.FotoPerfilNo64.type;
    const finalUserToSend = JSON.parse(JSON.stringify(userToCreate));
    //convertir File to base 64
    let file64 = await handleFileConversion(
      new File(
        [userToCreate.FotoPerfilNo64],
        userToCreate.FotoPerfilNo64.name,
        {
          type: userToCreate.FotoPerfilNo64.type,
        },
      ),
    );
    finalUserToSend.FotoPerfil = file64;
    finalUserToSend.type = fileType;
    finalUserToSend.FechaNacimiento = parseDateWithOutTime(
      userToCreate.FechaNacimiento,
    );
    delete finalUserToSend.FotoPerfilNo64;
    await FlowCraftAPI.post('Users/CrearUsuario', finalUserToSend);
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}
export async function EditUserByAdmin(userToEdit: any) {
  try {
    await FlowCraftAPI.post('Users/ActualizarUsuario', userToEdit);
    toast.success('Usuario editado con exito');
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export function createTimer(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Timer completed after ${ms} milliseconds`);
    }, ms);
  });
}

export async function getTyCToBack() {
  try {
    return await FlowCraftAPI.get('Configuracion/ObtenerTYC', false);
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}
export async function getPerfilesAction() {
  try {
    return await FlowCraftAPI.get('Configuracion/GetPerfiles');
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function getQuienesSomosAction() {
  try {
    return await FlowCraftAPI.get(
      'Configuracion/GetPerfilClubQuienesSomos',
      false,
    );
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function getNewsAction() {
  try {
    return await FlowCraftAPI.get(
      'Noticias/GetNoticiasActivasSimpatizante',
      false,
    );
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function getDisciplinasctionAction() {
  try {
    return await FlowCraftAPI.get(
      'DisciplinasYLecciones/GetDisciplinasMenu',
      false,
    );
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function getInstalacionesAction() {
  try {
    return await FlowCraftAPI.get(
      'Reservas/GetInstalacionesActivasSimpatizante',
      false,
    );
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function getNewsByIdSimpatizante(id: any) {
  try {
    return await FlowCraftAPI.get(
      `Noticias/GetNoticiaByIdSimpatizante/${id}`,
      false,
    );
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function sentRecoverPasswordCode(email: any) {
  try {
    const result = verifyEmail.safeParse({ Email: email });
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    const { data } = result;
    await FlowCraftAPI.post('Users/ReestablecerContrasenaInit', data, false);
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
    return { error: true };
  }
}

export async function verifyRecorveryCode(code: any, Mail: any) {
  try {
    const result = verifyEmailCode.safeParse({ Code: code });
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    const {
      data: { Code },
    } = result;
    await FlowCraftAPI.post(
      'Users/VerificarCodigo',
      { Codigo: Code, Mail },
      false,
    );
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
    return { error: true };
  }
}

export async function changePassword(
  Contrasena: any,
  OtraContrasena: any,
  email: any,
  code: any,
) {
  try {
    const result = verifyPasswords.safeParse({ Contrasena, OtraContrasena });
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    await FlowCraftAPI.post(
      'Users/ReestablecerContrasena',
      { NuevaPassword: Contrasena, Mail: email, Codigo: code },
      false,
    );
    return;
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
    return { error: true };
  }
}

export async function changePasswordWithoutCode(
  Contrasena: any,
  OtraContrasena: any,
  email: any,
  jwt: any,
) {
  try {
    const result = verifyPasswords.safeParse({ Contrasena, OtraContrasena });
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    await FlowCraftAPI.post(
      'Users/ReestablecerContrasenaPorVencimiento',
      { NuevaPassword: Contrasena, Mail: email },
      false,
      false,
      jwt,
    );
    return;
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
    return { error: true };
  }
}

export async function getUserToShow() {
  try {
    return await FlowCraftAPI.get('Users/GetMiPerfil');
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
    return { error: true };
  }
}

export async function UpdateUser(UpdateUserSchema: any, setErrors: any) {
  const result = UpdateUserSchemaZod.safeParse(UpdateUserSchema);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  setErrors([]);
  const { data: userToEdit } = result;
  const finalUserToSend = JSON.parse(JSON.stringify(userToEdit));
  //convertir File to base 64
  if (userToEdit.FotoPerfil) {
    const fileType = userToEdit.FotoPerfil.type;
    let file64 = await handleFileConversion(
      new File([userToEdit.FotoPerfil], userToEdit.FotoPerfil.name, {
        type: userToEdit.FotoPerfil.type,
      }),
    );
    finalUserToSend.FotoPerfil = file64;
    finalUserToSend.type = fileType;
  }
  finalUserToSend.FechaNacimiento = parseDateWithOutTime(
    userToEdit.FechaNacimiento,
  );
  await FlowCraftAPI.post('Users/EditarMiPerfil', finalUserToSend);
}

export async function getUserByDni(dni: any) {
  return await FlowCraftAPI.get(`Users/RecuperarUsuarioByDni?dni=${dni}`);
}

export async function clearPasswordByEmail(email: any) {
  return await FlowCraftAPI.post(`Users/BlanquearContrasena?mail=${email}`);
}

export async function cancelUserAction() {
  await FlowCraftAPI.post('Users/DarseDeBaja', {});
}

export async function asociateUser() {
  await FlowCraftAPI.post('Users/AsociarseMiPerfil', {});
}

//config_del_sistema

export async function getUsersAdmin() {
  return await FlowCraftAPI.get('Users/GetUsuarios');
}

export async function getDisciplinasAdmin() {
  return await FlowCraftAPI.get('DisciplinasYLecciones/GetDisciplinas');
}

export async function getPerfilesAdmin() {
  return await FlowCraftAPI.get('Configuracion/GetPerfiles');
}

export async function getPermisosAdmin() {
  return await FlowCraftAPI.get('Configuracion/GetPermisos');
}

export async function deleteDisciplineAction(id: string) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/EliminarDisciplina?id=${id}`,
  );
}
export async function createDisciplineAction(dis: any) {
  return await FlowCraftAPI.post(`DisciplinasYLecciones/CrearDisciplina`, dis);
}
export async function createPerfilAction(dis: any, setErrors: any) {
  const result = CreatePerfilSchema.safeParse(dis);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  setErrors([]);
  return await FlowCraftAPI.post(`Configuracion/CrearPerfil`, dis);
}
export async function editPerfilAction(dis: any) {
  return await FlowCraftAPI.post(`Configuracion/ActualizarPerfil`, dis);
}

export async function eliminarPerfilAdmin(id: any) {
  return await FlowCraftAPI.post(`Configuracion/EliminarPerfil/${id}`);
}

export async function getSolicitudesAdmin(id: any) {
  return await FlowCraftAPI.get(
    `Users/GetSolicitudesAsociacionFiltradas?id=${id}`,
  );
}

export async function gestionarSolicitudAdmin(solicitud: any) {
  return await FlowCraftAPI.post(
    `Users/GestionarSolicitudesAsociacion`,
    solicitud,
  );
}

export async function editDisciplineAction(dis: any) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/ActualizarDisciplina`,
    dis,
  );
}

export async function createNew(createdNew: any) {
  try {
    const result = editCreateNewSchema.safeParse(createdNew);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    const { data: nw } = result;
    const finalNew = JSON.parse(JSON.stringify(nw));
    //convertir File to base 64
    let file64 = await handleFileConversion(
      new File([nw.foto], nw.foto.name, {
        type: nw.foto.type,
      }),
    );
    finalNew.Titulo = nw.titulo;
    finalNew.Descripcion = nw.descripcion;
    finalNew.Imagen = file64;
    finalNew.FechaInicio = formatDateToISOString(nw.fechaInicio);
    finalNew.FechaFin = formatDateToISOString(nw.fechaFin);
    delete finalNew.titulo;
    delete finalNew.foto;
    delete finalNew.descripcion;
    delete finalNew.fechaInicio;
    delete finalNew.fechaFin;
    console.log(finalNew);
    return await FlowCraftAPI.post(`Noticias/CrearNoticia`, finalNew);
  } catch (error: any) {
    toast.error(error.message);
  }
}

export async function editNew(editedNew: any) {
  try {
    const finalNew = JSON.parse(JSON.stringify(editedNew));
    if (editedNew.foto.name) {
      //convertir File to base 64
      let file64 = await handleFileConversion(
        // @ts-ignore
        new File([editedNew.foto], editedNew.foto.name, {
          // @ts-ignore
          type: editedNew.foto.type,
        }),
      );
      finalNew.Imagen = file64;
    } else {
      finalNew.Imagen = editedNew.foto;
    }
    finalNew.Id = editedNew.id;
    finalNew.Titulo = editedNew.titulo;
    finalNew.Descripcion = editedNew.descripcion;
    finalNew.FechaInicio = editedNew.fechaInicio;
    finalNew.FechaFin = editedNew.fechaFin;
    delete finalNew.titulo;
    delete finalNew.foto;
    delete finalNew.descripcion;
    delete finalNew.fechaInicio;
    delete finalNew.fechaFin;
    delete finalNew.id;
    delete finalNew.imagen;
    return await FlowCraftAPI.post(`Noticias/ActualizarNoticia`, finalNew);
  } catch (error: any) {
    toast.error(error.message);
  }
}

export async function deleteNewAction(id: any) {
  return await FlowCraftAPI.post(`Noticias/EliminarNoticia/${id}`);
}

//TIPOS

export async function getTipoEventosAdmin() {
  return await FlowCraftAPI.get(`Eventos/GetTiposEvento`);
}

export async function crearTipoEventosAdmin(eventoAcrear: any) {
  const result = tipoAcrearSchema.safeParse(eventoAcrear);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Eventos/CrearTipoEvento`, eventoAcrear);
}

export async function editarTipoEventosAdmin(eventoAcrear: any) {
  return await FlowCraftAPI.post(`Eventos/ActualizarTipoEvento`, eventoAcrear);
}

export async function eliminarTipoEventosAdmin(eventoAcrear: any) {
  return await FlowCraftAPI.post(`Eventos/EliminarTipoEvento`, eventoAcrear);
}

export async function getTipoAccionPartidosAdmin() {
  return await FlowCraftAPI.get(`Partidos/GetTiposAccionPartido`);
}

export async function crearTipoAccionPartidosAdmin(eventoAcrear: any) {
  const result = tipoAccionPartidoSchema.safeParse(eventoAcrear);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `Partidos/CrearTipoAccionPartido`,
    eventoAcrear,
  );
}

export async function editarTipoAccionPartidoAdmin(eventoAcrear: any) {
  return await FlowCraftAPI.post(
    `Partidos/ActualizarTipoAccionPartido`,
    eventoAcrear,
  );
}

export async function eliminarTipoAccionPartidoAdmin(eventoAcrear: any) {
  return await FlowCraftAPI.post(
    `Partidos/EliminarTipoAccionPartido`,
    eventoAcrear,
  );
}

// INSTALACIONES
export async function getInstalacionesAdmin() {
  return await FlowCraftAPI.get(`Reservas/GetInstalaciones`);
}

export async function getInstalacionesEstadoAdmin() {
  return await FlowCraftAPI.get(`Configuracion/GetInstalacionEstado`);
}

export async function crearInstalacionAction(instalacion: any) {
  const result = crearInstalacionSchema.safeParse(instalacion);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Reservas/CrearInstalacion`, instalacion);
}

export async function editarInstalacionAction(instalacion: any) {
  const result = crearInstalacionSchema.safeParse(instalacion);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Reservas/ActualizarInstalacion`, instalacion);
}

export async function eliminarInstalacionAdmin(instalacion: any) {
  const result = crearInstalacionSchema.safeParse(instalacion);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Reservas/EliminarInstalacion/${instalacion}`);
}
