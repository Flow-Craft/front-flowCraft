'use client';
import {
  LOCAL_STORAGE_NAME_KEY,
  LOCAL_STORAGE_PERFIL_KEY,
} from '@/app/utils/const';
import { useEffect, useState } from 'react';

export default function UserName() {
  const [name, setName] = useState('');
  const [perfil, setPerfil] = useState('');
  useEffect(() => {
    const storedName =
      window.localStorage.getItem(LOCAL_STORAGE_NAME_KEY) || '';
    const perfil = window.localStorage.getItem(LOCAL_STORAGE_PERFIL_KEY) || '';
    setName(storedName);
    setPerfil(perfil);
  }, []);

  return (
    <div className="mb-8">
      <div>{`Hola ${name}!!!`}</div>
      <div className="font-bold">{perfil}</div>
    </div>
  );
}
