This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

BACKUP DATABASE [flow]
TO DISK = N'/var/opt/mssql/backup/flow.bak'
WITH NOFORMAT, NOINIT, NAME = 'Full Backup of MiBaseDeDatos', SKIP, NOREWIND, NOUNLOAD, STATS = 10;

-- Obtener los nombres lógicos de los archivos de la base de datos
RESTORE FILELISTONLY
FROM DISK = N'/var/opt/mssql/backup/flow.bak';

-- Carpertas necesarias dentro del front
/database
/backups

una para poder tener la data de la base directamente en la pc
y la de abajo para poder restaurar backups directamente en el contenedor

-- Restaurar la base de datos
USE master;
RESTORE DATABASE [flowCraft]
FROM DISK = N'/var/opt/mssql/backup/flowCraft.bak'
WITH REPLACE,
MOVE 'flowCraft' TO '/var/opt/mssql/data/flowCraft.mdf',
MOVE 'flowCraft_log' TO '/var/opt/mssql/data/flowCraft_log.ldf';

dotnet build
dotnet run

esto va en un archivo llamado appsettings.Development.json
en la raiz del proyecto de backend solo para linux
{
    "ApiSettings": {
    "secretToken": "Muchaaaachos ahora nos volvimo a ilusionar, quiero ganar la tercera, quiero ser campeon mundial"
    },
    "ConnectionStrings": {
        "flowCraft": "Server=localhost,1433;Database=flowCraft;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=true;"
    },
    "Logging": {
        "LogLevel": {
        "Default": "Information",
        "Microsoft.AspNetCore": "Warning"
        }
    }
}

//Excalidraw
https://excalidraw.com/#json=KS4i_r1UgdXQosLEwNVdb,oUVPDZZ27cT7MvAwpNxB0Q


// puede que al intentar ejecutar el contenedor de sql de un error al intentar escribir en la carpeta base de datos
sudo chmod -R 777 ./backups
sudo chmod -R 777 ./database

con estos comandos se le da permiso al contenedor para escribir.
