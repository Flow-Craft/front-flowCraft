export const handleFileConversion = (
  file: File,
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      resolve(base64);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

export function parseDateWithOutTime(fechaStr: string) {
  const [year, month, day] = fechaStr.split('-');
  return `${year}-${month}-${day}T00:00:00`;
}
