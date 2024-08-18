'use client';

import FlowCraftAPI from './request';
import toast from 'react-hot-toast';
import { AUTORIZATION_KEY, LOCAL_STORAGE_NAME_KEY } from './const';
import { loginUserSchema, RegistryUserSchemaZod } from './models/user';
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
      new File(
        [user.FotoPerfilNo64],
        user.FotoPerfilNo64.name,
        { type: user.FotoPerfilNo64.type },
      ),
    );
    finalUserToSend.FotoPerfil = file64
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

function createTimer(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Timer completed after ${ms} milliseconds`);
    }, ms);
  });
}
