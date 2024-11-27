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
  EditUserByAdminSchemaZod,
} from './models/user';
import { editCreateNewSchema } from './models/news';
import { categoriaSchema, eventoSchema } from './models/eventos';
import { eventoPartidoEditarSchema, eventoPartidoEditarSchemaImageString, eventoPartidoSchema, eventoPartidoSchemaImageString } from './models/eventoPartido';
import { equipoEstadoSchema } from './models/estados';
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
      window.location.href = '/inicio/noticias';
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
      'Usuario creado con éxito. Será redirigido a la pantalla de login',
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
    const result = EditUserByAdminSchemaZod.safeParse(userToEdit);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }

    const finalUserToSend = JSON.parse(JSON.stringify(userToEdit));
    //convertir File to base 64
    if (userToEdit.FotoPerfilNo64) {
      const fileType = userToEdit.FotoPerfilNo64.type;
      let file64 = await handleFileConversion(
        new File([userToEdit.FotoPerfilNo64], userToEdit.FotoPerfilNo64.name, {
          type: userToEdit.FotoPerfilNo64.type,
        }),
      );
      finalUserToSend.FotoPerfil = file64;
      finalUserToSend.type = fileType;
      finalUserToSend.FechaNacimiento = parseDateWithOutTime(
        userToEdit.FechaNacimiento,
      );
      delete finalUserToSend.FotoPerfilNo64;
    }
    await FlowCraftAPI.post('Users/ActualizarUsuario', userToEdit);
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

export async function eliminarUsuarioAction(id: any) {
  return await FlowCraftAPI.post(`Users/EliminarUsuario?id=${id}`);
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

export async function actualizarTyC(body: any) {
  await FlowCraftAPI.post('Configuracion/CrearTYC', body);
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

export async function getInstalacionesActionAdmin() {
  try {
    return await FlowCraftAPI.get('Reservas/GetInstalacionesActivas');
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
    console.log('result', result);
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

export async function getCategoriaAdmin() {
  return await FlowCraftAPI.get('DisciplinasYLecciones/GetCategorias');
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

export async function crearCategoriaAdmin(dis: any, setErrors: any) {
  const result = categoriaSchema.safeParse(dis);

  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  setErrors([]);
  return await FlowCraftAPI.post(`DisciplinasYLecciones/CrearCategoria`, dis);
}

export async function editarCategoriaAdmin(dis: any) {
  const result = categoriaSchema.safeParse(dis);

  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/ActualizarCategoria`,
    dis,
  );
}

export async function eliminarCategoriaAdmin(idCategoria: any) {
  return await FlowCraftAPI.post(`DisciplinasYLecciones/EliminarCategoria`, {
    Id: idCategoria,
  });
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

export async function getInstalacionesActivasAdmin() {
  return await FlowCraftAPI.get(`Reservas/GetInstalacionesActivas`);
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
  return await FlowCraftAPI.post(`Reservas/EliminarInstalacion/${instalacion}`);
}

// Estados

export async function getEquipoEstadoAdmin() {
  return await FlowCraftAPI.get(`Configuracion/GetEquipoEstado`);
}

export async function crearEquipoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Configuracion/CrearEquipoEstado`, equipo);
}

export async function editarEquipoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `Configuracion/ActualizarEquipoEstado`,
    equipo,
  );
}

export async function eliminarEquipoEstadoAdmin(id: any) {
  return await FlowCraftAPI.post(`Configuracion/EliminarEquipoEstado/${id}`);
}

export async function getEventosEstadoAdmin() {
  return await FlowCraftAPI.get(`Configuracion/GetEventoEstado`);
}

export async function crearEventoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  console.log('result', result);
  return await FlowCraftAPI.post(`Configuracion/CrearEventoEstado`, equipo);
}

export async function editarEventoEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `Configuracion/ActualizarEventoEstado`,
    equipo,
  );
}

export async function eliminarEventoEstadoAdmin(id: any) {
  return await FlowCraftAPI.post(`Configuracion/EliminarEventoEstado/${id}`);
}

export async function getUsuarioEstadoAdmin() {
  return await FlowCraftAPI.get(`Configuracion/GetUsuarioEstado`);
}

export async function crearUsuarioEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Configuracion/CrearUsuarioEstado`, equipo);
}

export async function editarUsuarioEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `Configuracion/ActualizarUsuarioEstado`,
    equipo,
  );
}

export async function eliminarUsuarioEstadoAdmin(id: any) {
  return await FlowCraftAPI.post(`Configuracion/EliminarUsuarioEstado/${id}`);
}

export async function getLeccionEstadoAdmin() {
  return await FlowCraftAPI.get(`DisciplinasYLecciones/GetLeccionesEstados`);
}

export async function crearLeccionEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/CrearLeccionEstado`,
    equipo,
  );
}

export async function editarLeccionEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/ActualizarLeccionEstado`,
    equipo,
  );
}

export async function eliminarLeccionEstadoAdmin(id: any) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/EliminarLeccionEstado`,
    { Id: id },
  );
}

export async function getInstalacionEstadoAdmin() {
  return await FlowCraftAPI.get(`Configuracion/GetInstalacionEstado`);
}

export async function crearInstalacionEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `Configuracion/CrearInstalacionEstado`,
    equipo,
  );
}

export async function editarInstalacionEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(
    `Configuracion/ActualizarInstalacionEstado`,
    equipo,
  );
}

export async function eliminarInstalacionEstadoAdmin(id: any) {
  return await FlowCraftAPI.post(
    `Configuracion/EliminarInstalacionEstado/${id}`,
  );
}

export async function getTorneoEstadoAdmin() {
  return await FlowCraftAPI.get(`Torneos/GetTorneoEstados`);
}

export async function crearTorneoEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Torneos/CrearTorneoEstado`, equipo);
}

export async function editarTorneoEstadoAdmin(equipo: any) {
  const result = equipoEstadoSchema.safeParse(equipo);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  return await FlowCraftAPI.post(`Torneos/ActualizarTorneoEstado`, equipo);
}

export async function eliminarTorneoEstadoAdmin(id: any) {
  return await FlowCraftAPI.post(`Torneos/EliminarTorneoEstado`, { Id: id });
}

// EVENTOS

export async function getCategoriasActivasAdmin() {
  return await FlowCraftAPI.get(`DisciplinasYLecciones/GetCategoriasActivas`);
}

export async function getEventosAdmin() {
  return await FlowCraftAPI.get(`Eventos/GetEventos`);
}

export async function crearEventosAdmin(evento: any) {
  const result = eventoSchema.safeParse(evento);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  const fileType = evento.Banner.type;
  const eventToSend = JSON.parse(JSON.stringify(evento));
  //convertir File to base 64
  let file64 = await handleFileConversion(
    new File([evento.Banner], evento.Banner.name, {
      type: evento.Banner.type,
    }),
  );
  eventToSend.Banner = file64;
  eventToSend.type = fileType;
  eventToSend.FechaInicio = eventToSend.FechaInicio + ':00';
  eventToSend.FechaFinEvento = eventToSend.FechaFinEvento + ':00';
  return await FlowCraftAPI.post(`Eventos/CrearEvento`, eventToSend);
}

export async function crearEventosPartidoAdmin(evento: any) {
  const result = eventoPartidoSchema.safeParse(evento);
  if (!result.success) {
    return { error: true, errors: result.error.errors };
  }
  const fileType = evento.Banner.type;
  const eventToSend = JSON.parse(JSON.stringify(evento));
  //convertir File to base 64
  let file64 = await handleFileConversion(
    new File([evento.Banner], evento.Banner.name, {
      type: evento.Banner.type,
    }),
  );
  eventToSend.Banner = file64;
  eventToSend.type = fileType;
  eventToSend.FechaInicio = eventToSend.FechaInicio + ':00';
  eventToSend.FechaFinEvento = eventToSend.FechaFinEvento + ':00';
  eventToSend.IdsDisciplinas = [Number(eventToSend.IdsDisciplinas)];
  return await FlowCraftAPI.post(`Eventos/CrearEvento`, eventToSend);
}

export async function editarEventoAdmin(evento: any) {
  const eventToSend = JSON.parse(JSON.stringify(evento));
  if (evento?.banner?.name) {
    const result = eventoPartidoEditarSchema.safeParse(evento);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
    const fileType = evento.Banner.type;
    //convertir File to base 64
    let file64 = await handleFileConversion(
      new File([evento.Banner], evento.Banner.name, {
        type: evento.Banner.type,
      }),
    );
    eventToSend.Banner = file64;
    eventToSend.type = fileType;
  }else{
    const result = eventoPartidoEditarSchemaImageString.safeParse(evento);
    if (!result.success) {
      return { error: true, errors: result.error.errors };
    }
  }
  eventToSend.FechaInicio = eventToSend.FechaInicio + ':00';
  eventToSend.FechaFinEvento = eventToSend.FechaFinEvento + ':00';
  return await FlowCraftAPI.post(`Eventos/ActualizarEvento`, eventToSend);
}

export async function eliminarEventosAdmin(id: any) {
  return await FlowCraftAPI.post(`Eventos/EliminarEvento`, { Id: id });
}

export async function tomarAsistenciaAdmin(usuarioEvento: any) {
  return await FlowCraftAPI.post(`Eventos/TomarAsistencia`, usuarioEvento);
}

export async function getEventoByUsuarioByIdAdmin(eventId: any) {
  return await FlowCraftAPI.get(`Eventos/GetEventoByIdByUsuario?id=${eventId}`);
}

export async function inscribirseAEventoAdmin(eventId: any) {
  return await FlowCraftAPI.post(
    `Eventos/InscribirseByUsuario?IdEvento=${eventId}`,
  );
}

export async function desinscribirseAEventoAdmin(eventId: any) {
  return await FlowCraftAPI.post(
    `Eventos/DesinscribirseByUsuario?IdEvento=${eventId}`,
  );
}

export async function getEquiposActivos() {
  return await FlowCraftAPI.get(`Partidos/GetEquiposActivos`);
}

export async function getEquiposActivosByUsuario() {
  return await FlowCraftAPI.get(`Partidos/GetEquiposByUsuario`);
}

export async function crearNuevoEquipo(equipo: any) {
  return await FlowCraftAPI.post(`Partidos/CrearEquipo`, equipo);
}
export async function elimarEquipoAdmin(id: any) {
  return await FlowCraftAPI.post(`Partidos/EliminarEquipo`, { Id: id });
}

export async function getEquiposById(id: any) {
  return await FlowCraftAPI.get(`Partidos/GetEquipoById?Id=${id}`);
}

export async function editarEquipoExistente(equipo: any) {
  return await FlowCraftAPI.post(`Partidos/ActualizarEquipo`, equipo);
}

export async function getEquipoByDisciplinaYCategoria(
  idDisciplina: any,
  idCategoria: any,
) {
  return await FlowCraftAPI.get(
    `Partidos/GetEquiposByCategoriaAndDisciplinaActivos?IdCategoria=${idCategoria}&IdDisciplina=${idDisciplina}`,
  );
}

export async function getPerfilByNombreAdmin(nombrePerfil: any) {
  return await FlowCraftAPI.get(
    `Users/GetUsuariosByPerfil?perfil=${nombrePerfil}`,
  );
}

export async function getPartidoByIdAdmin(id: any) {
  return await FlowCraftAPI.get(`Partidos/GetPartidoById?id=${id}`);
}

export async function getPartidoAdmin(id: any) {
  return await FlowCraftAPI.get(`Partidos/GetPartidos`);
}

export async function getPartidosAsignadosAdmin() {
  return await FlowCraftAPI.get(`Partidos/GetPartidosAsignados`);
}

export async function getEventosActivos() {
  return await FlowCraftAPI.get(`Eventos/GetEventosActivos`);
}

//PARTIDOS
export async function suspenderPartidoAdmin(idEquipo: any, motivo: any) {
  return await FlowCraftAPI.post(`Partidos/SuspenderPartido`, {
    Id: idEquipo,
    Motivo: motivo,
  });
}

export async function IniciarPartidoAdmin(partido: any) {
  return await FlowCraftAPI.post(`Partidos/IniciarPartido`, partido);
}

export async function getActionPartidoByIdAdmin(id: any) {
  return await FlowCraftAPI.get(
    `Partidos/GetAccionPartidoByPartido?IdPartido=${id}`,
  );
}

export async function getActionPartidoPanelAdmin(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Partidos/GetTiposAccionPaneles?${queryString}`,
  );
}

export async function finalizarPartidoAdmin(idPartido: any) {
  return await FlowCraftAPI.post(
    `Partidos/FinalizarPartido?partidoId=${idPartido}`,
  );
}

export async function finalizarTiempoAdmin(idPartido: any) {
  return await FlowCraftAPI.post(
    `Partidos/FinalizarTiempo?partidoId=${idPartido}`,
  );
}

export async function iniciarTiempoAdmin(idPartido: any) {
  return await FlowCraftAPI.post(
    `Partidos/IniciarTiempo?partidoId=${idPartido}`,
  );
}

export async function cargarAccionPartidoAdmin(body: any) {
  return await FlowCraftAPI.post(`Partidos/AltaAccionPartido`, body);
}

export async function eliminarAccionPartidoAdmin(body: any) {
  return await FlowCraftAPI.post(`Partidos/BajaAccionPartido`, body);
}

export async function getPlanilleroYArbritroByPartidoId(idPartido: any) {
  return await FlowCraftAPI.get(
    `Partidos/GetArbitroPlanilleroPartido?idPartido=${idPartido}`,
  );
}

export async function getAsingacionPartido(idPartido: any,planillero=true,arbitro=true) {
  return await FlowCraftAPI.get(
    `Partidos/AsignacionPartido?Planillero=${planillero}&Arbitro=${arbitro}&PartidoId=${idPartido}`,
  );
}

export async function getAccionesPorUsuarioYPartido({
  IdPartido,
  NroJugador,
}: any) {
  const queryString = new URLSearchParams({ IdPartido, NroJugador }).toString();
  return await FlowCraftAPI.get(
    `Partidos/GetEstadisticasByPartidoUsu?${queryString}`,
  );
}

export async function altaEstaditicaPartidoAccionUsuario(body: any) {
  return await FlowCraftAPI.post(`Partidos/AltaEstadistica`, body);
}

export async function bajaEstaditicaPartidoAccionUsuario(body: any) {
  return await FlowCraftAPI.post(`Partidos/ActualizarEstadistica`, body);
}

//REPORTES

export async function getReporteByUsuarioYPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEventoByUsuarioPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function getReporteByEvento(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEventoByEvento?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function getReporteByPeriodoTipoEvento(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEventoByTipoEventoPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function getReporteByPeriodoInstalacion(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEventoByInstalacionPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function ReporteReservasByUsuarioPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteReservasByUsuarioPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function ReporteReservasByInstalacionPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteReservasByInstalacionPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function ReporteReservasByPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteReservasByPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function reporteEstadisticasByDiscUsuPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEstadisticasByDiscUsuPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function reporteEstadisticasByDiscUsuLeccionPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEstadisticasByDiscUsuLeccionPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function reporteEstadisticasByDiscEquipoPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteEstadisticasByDiscEquipoPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function reporteLeccionUsuarioPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteLeccionUsuarioPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

export async function reporteLeccionDisciplinaCategoriaPeriodo(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `Reportes/ReporteLeccionDisciplinaCategoriaPeriodo?${queryString}`,
    true,
    {
      'Content-Type': 'application/pdf',
    },
  );
}

// LECCIONES

export async function getLeccionesAdmin() {
  return await FlowCraftAPI.get(`DisciplinasYLecciones/GetLeccionesCompletas`);
}

export async function crearLeccionAdmin(body: any) {
  return await FlowCraftAPI.post(`DisciplinasYLecciones/CrearLeccion`, body);
}

export async function editarLeccionAdmin(body: any) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/ActualizarLeccion`,
    body,
  );
}

export async function eliminarLeccionAdmin(body: any) {
  return await FlowCraftAPI.post(`DisciplinasYLecciones/EliminarLeccion`, body);
}

export async function getLeccionesActivasAdmin() {
  return await FlowCraftAPI.get(`DisciplinasYLecciones/GetLeccionesActivas`);
}

export async function inscribirseALeccion(body: any) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/InscribirseALeccion`,
    body,
  );
}

export async function desinscribirseALeccion(body: any) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/DesinscribirseALeccion`,
    body,
  );
}

export async function getInscricionesDelUsuario() {
  return await FlowCraftAPI.get(
    `DisciplinasYLecciones/GetInscripcionesByUsuario`,
  );
}

export async function getleccionesAsignadas() {
  return await FlowCraftAPI.get(`DisciplinasYLecciones/Getleccionesasignadas`);
}

export async function getInscripcionesALecciones(id: any) {
  return await FlowCraftAPI.get(
    `DisciplinasYLecciones/GetInscripcionesALecciones?Id=${id}`,
  );
}

export async function iniciarLeccionAdmin(body: any) {
  return await FlowCraftAPI.post(`DisciplinasYLecciones/IniciarLeccion`, body);
}
export async function finalizarLeccionAdmin(id: any) {
  return await FlowCraftAPI.post(
    `DisciplinasYLecciones/FinalizarLeccion?Id=${id}`,
  );
}

export async function getLeccionById(id: any) {
  return await FlowCraftAPI.get(
    `DisciplinasYLecciones/GetLeccionById?Id=${id}`,
  );
}

export async function getAsistenciasByIdLeccion(id: any) {
  return await FlowCraftAPI.get(
    `DisciplinasYLecciones/GetAsistencias?idLeccion=${id}`,
  );
}

export async function getEstadisticasByIdLeccionYIdAsistencia(body: any) {
  const queryString = new URLSearchParams(body).toString();
  return await FlowCraftAPI.get(
    `DisciplinasYLecciones/GetEstadisticasByLeccionUsuario?${queryString}`,
  );
}

//TORNEOS

export async function AltaDeTorneo(evento: any) {
  const fileType = evento.BannerNo64.type;
  const eventToSend = JSON.parse(JSON.stringify(evento));
  //convertir File to base 64
  let file64 = await handleFileConversion(
    new File([evento.BannerNo64], evento.BannerNo64.name, {
      type: evento.BannerNo64.type,
    }),
  );
  eventToSend.Banner = file64;
  eventToSend.type = fileType;
  delete eventToSend.BannerNo64;
  console.log('eventToSend', eventToSend);
  return await FlowCraftAPI.post(`Torneos/AltaTorneo`, eventToSend);
}

export async function getTorneosAdmin() {
  return await FlowCraftAPI.get(`Torneos/GetTorneos`);
}

export async function getTorneoById(id: any) {
  return await FlowCraftAPI.get(`Torneos/GetTorneoById?idTorneo=${id}`);
}

export async function eliminarTorneoAdmin(id: any) {
  return await FlowCraftAPI.post(`Torneos/EliminarTorneo?idTorneo=${id}`);
}

export async function getEquiposByDisciplinaCategoriaYUsuario(
  idCategoria: any,
  idDisciplina: any,
) {
  return await FlowCraftAPI.get(
    `Partidos/GetEquiposByCategoriaAndDisciplinaActivos?IdCategoria=${idCategoria}&IdDisciplina=${idDisciplina}`,
  );
}

export async function inscribirmeATorneoAdmin(idEquipo: any, idTorneo: any) {
  return await FlowCraftAPI.post(
    `Torneos/InscribirseATorneo?idTorneo=${idTorneo}&idEquipo=${idEquipo}`,
  );
}

export async function desinscribirmeATorneoAdmin(idEquipo: any, idTorneo: any) {
  return await FlowCraftAPI.post(
    `Torneos/DesinscribirseATorneo?idTorneo=${idTorneo}&idEquipo=${idEquipo}`,
  );
}

export async function getTorneoByUsuario() {
  return await FlowCraftAPI.get(`Torneos/GetTorneosByUsuario`);
}

export async function EditarTorneo(evento: any) {
  const eventToSend = JSON.parse(JSON.stringify(evento));
  if (evento.BannerNo64) {
    const fileType = evento.BannerNo64.type;
    //convertir File to base 64
    let file64 = await handleFileConversion(
      new File([evento.BannerNo64], evento.BannerNo64.name, {
        type: evento.BannerNo64.type,
      }),
    );
    eventToSend.Banner = file64;
    eventToSend.type = fileType;
  }
  delete eventToSend.BannerNo64;
  return await FlowCraftAPI.post(`Torneos/EditarTorneo`, eventToSend);
}

// ESTADISTICAS
export async function GetEstadisticasByUsuarioDNI(dniUsuario: any) {
  return await FlowCraftAPI.get(
    `Partidos/GetEstadisticasByUsuario?dniUsuario=${dniUsuario}`,
  );
}

export async function GetEstadisticasByUsuarioLogin() {
  return await FlowCraftAPI.get(`Partidos/GetEstadisticasByUsuarioLogin`);
}

/// RESERVAS

export async function getReservasVigentes() {
  return await FlowCraftAPI.get(`Reservas/GetReservasVigentes`);
}

export async function getReservasVigentesByUsuario() {
  return await FlowCraftAPI.get(`Reservas/GetReservasByUsuario`);
}

export async function eliminarReservaAdmin(idReserva: any) {
  return await FlowCraftAPI.post(`Reservas/EliminarReserva?id=${idReserva}`);
}

export async function crearReservaAdmin(body: any) {
  return await FlowCraftAPI.post(`Reservas/CrearReserva`, body);
}

export async function getReservasVigentesById(id: any) {
  return await FlowCraftAPI.get(`Reservas/GetReservaById?id=${id}`);
}

export async function editarReservaAdmin(body: any) {
  return await FlowCraftAPI.post(`Reservas/ActualizarReserva`, body);
}

// BACKUP

export async function subirBackups(tipo: any, body: any) {
  return await FlowCraftAPI.post(`Backup/SubirBackup?tipo=${tipo}`, body);
}

export async function obtenerBackups() {
  return await FlowCraftAPI.get(`Backup/ObtenerBackups`);
}
