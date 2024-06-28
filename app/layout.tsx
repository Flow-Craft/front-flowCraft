import { monserrant  } from './ui/fonts'; // import fonts to use in all platform
import './ui/global.css';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${monserrant.className} antialised`}>
        {children}
      </body>
      
    </html>
  );
}
