'use client'

import { LOCAL_STORAGE_NAME_KEY } from "@/app/lib/const";
import { getItemInLocalStorage } from "@/app/lib/localStorageActions";
import { useMemo } from "react";

export default function UserName() {

    const userName = useMemo(()=>{
        return getItemInLocalStorage(LOCAL_STORAGE_NAME_KEY)
    },[])

    return (
        <>
            <div>Hola {userName}!!!</div>
            <div className='font-bold'>Administrativo</div>
        </>
    );
  }
  