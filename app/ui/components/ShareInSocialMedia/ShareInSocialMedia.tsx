import React from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ShareIcon } from '@heroicons/react/24/outline';

const WEB_URL = 'http://localhost:3001/noticia/';
const TEXT_TO_SEND = 'Mira que genial noticia en flowCraft';

export const ShareInSocialMedia = ({ newID }: { newID: number }) => {
  const shareTwitter = () => {
    return (
      <a
        href={`https://twitter.com/intent/tweet?text=${TEXT_TO_SEND}&url=${WEB_URL}${newID}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Compartir en Twitter
      </a>
    );
  };
  const shareWhatsApp = () => (
    <a
      href={`https://api.whatsapp.com/send?text=${TEXT_TO_SEND}%20${WEB_URL}${newID}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Compartir en WhatsApp
    </a>
  );
  const shareFacebook = () => (
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${WEB_URL}${newID}&quote=${TEXT_TO_SEND}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Compartir en Facebook
    </a>
  );
  return (
    <Menu>
      <MenuButton
        as={Button}
        className="bg-blue-500 shadow-lg shadow-blue-500/50"
      >
        <ShareIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 cursor-pointer text-gray-500 peer-focus:text-gray-900" />
      </MenuButton>
      <MenuList>
        <MenuItem>{shareTwitter()}</MenuItem>
        <MenuItem>{shareFacebook()}</MenuItem>
        <MenuItem>{shareWhatsApp()}</MenuItem>
      </MenuList>
    </Menu>
  );
};
