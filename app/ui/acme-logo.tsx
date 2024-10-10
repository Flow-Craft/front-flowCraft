import { monserrant } from '../ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${monserrant.className} flex flex-row items-center leading-none text-white`}
    >
      <img
        src="/favicon.ico"
        alt="Favicon"
        className="h-[50px] w-[50px] md:h-[130px] md:w-[130px]"
      />
      <p className="text-[38px]">FlowCraft</p>
    </div>
  );
}
