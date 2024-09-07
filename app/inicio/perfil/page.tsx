"use client"
import { QrGenerator } from "@/app/ui/QrGenerator/QrGenerator";
import { getUserToShow } from "@/app/utils/actions";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function Page() {
  const [userToShow, setUserToShow] = useState({})
  const getUser =async()=>{
    const result = await getUserToShow()
    console.log(result)
  }
  useEffect(()=>{
    getUser();
  },[])
  return <section>
    <section>
      <QrGenerator label="generar QR"/>
    </section>
    <section>

    </section>
    <Toaster/>
  </section>;
}
