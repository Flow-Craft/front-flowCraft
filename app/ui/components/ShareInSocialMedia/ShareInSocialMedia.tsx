import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ShareIcon } from '@heroicons/react/24/outline';

const WEB_URL = 'http://localhost:3001.com/noticia/';
const TEXT_TO_SEND = 'Mira que genial noticia en flowCraft: ';

export const ShareInSocialMedia = ({ newID }: { newID: number }) => {
  const shareTwitter = () => {
    window.open(
      `http://twitter.com/share?text=${TEXT_TO_SEND}&url=${WEB_URL}${newID}`,
      '_blank',
    );
  };
  const shareWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${TEXT_TO_SEND}%20${WEB_URL}${newID}`,
      '_blank',
    );
  };

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${WEB_URL}${newID}&quote=${TEXT_TO_SEND}`,
      '_blank',
    );
  };
  return (
    <Menu>
      <MenuButton
        as={Button}
        className="bg-blue-500 shadow-lg shadow-blue-500/50"
      >
        <ShareIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 cursor-pointer text-gray-500 peer-focus:text-gray-900" />
      </MenuButton>
      <MenuList>
        <MenuItem onClick={shareTwitter}>Compartir en X</MenuItem>
        <MenuItem onClick={shareFacebook}>Compartir en Facebook</MenuItem>
        <MenuItem onClick={shareWhatsApp}>Compartir en WhatsApp</MenuItem>
      </MenuList>
    </Menu>
  );
};
