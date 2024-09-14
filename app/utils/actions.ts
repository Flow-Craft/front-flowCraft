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
} from './models/user';
import { handleFileConversion, parseDateWithOutTime } from './manageFile';

export async function loginUser(formData: FormData) {
  try {
    const { Email, Contrasena } = loginUserSchema.parse({
      Email: formData.get('email'),
      Contrasena: formData.get('password'),
    });
    const response: any = await FlowCraftAPI.post(
      'Users/Login',
      {
        Email,
        Contrasena,
      },
      false,
    );
    if (response?.nombre)
      window.localStorage.setItem(LOCAL_STORAGE_NAME_KEY, response?.nombre);
    window.location.href = '/inicio/noticias';
  } catch (error: any) {
    toast.error(error.message);
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
      'Usuario Creado con exito. Sera redirigido a la pantalla de login',
    );
    await createTimer(2000);
    window.location.href = '/login';
  } catch (error: any) {
    toast.dismiss();
    toast.error(error.message);
  }
}

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

export async function cancelUserAction() {
  await FlowCraftAPI.post('Users/DarseDeBaja', {});
}

export async function asociateUser() {
  await FlowCraftAPI.post('Users/AsociarseMiPerfil', {});
}
