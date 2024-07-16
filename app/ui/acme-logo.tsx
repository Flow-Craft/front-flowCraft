import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { monserrant } from '../ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${monserrant.className} flex flex-row items-center leading-none text-white`}
    >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[38px]">FlowCraft</p>
    </div>
  );
}
