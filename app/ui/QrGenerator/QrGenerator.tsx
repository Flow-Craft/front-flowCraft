import React, { useState } from 'react'
import { QRCode } from 'react-qrcode-logo';
import { FlowModal } from '../components/FlowModal/FlowModal';


export const QrGenerator = ({label}:{label:string}) => {
    const [openModal, setOpenModal] = useState(false)
    const objetoDeEjemplo = {id:2,nombre:"Mario",email:"mamerida2013@gmail.com"}
    const bodyQr = (
        <section className='w-full flex justify-center'>
            <QRCode 
                value="https://campus.frm.utn.edu.ar/login/index.php"
                fgColor="#2f6feb" 
                logoImage="/logoQr.jpeg"
                logoWidth={100}
                logoHeight={100}
                size={300}
                qrStyle="fluid"
                logoPaddingStyle="circle"
                />
        </section>
    )
  return (
    <div>
        <button className='flex flex-col items-center cursor-pointer' onClick={()=>{setOpenModal(true)}}>
            <img className='w-20 h-20' src="/logoQr.jpeg"/>
            <label className='text-blue-600 font-bold'>{label}</label>
        </button>
        <FlowModal
            title="Credencial del usuario"
            modalBody={bodyQr}
            isOpen={openModal}
            onClose={()=>{setOpenModal(false)}}
            onAcceptModal={()=>{setOpenModal(false)}}
            secondaryTextButton=""
        />
    </div>
  )
}
