export const handleFileConversion = (
  file: File,
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64String = result.replace(
          /^data:[a-zA-Z]+\/[a-zA-Z]+;base64,/,
          '',
        );
        resolve(base64String);
      } else {
        reject(new Error('FileReader result is not a string'));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export function parseDateWithOutTime(fechaStr: string) {
  const [year, month, day] = fechaStr.split('-');
  return `${year}-${month}-${day}T00:00:00`;
}

export function formatDateToISOString(date: Date) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // meses de 0 a 11
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}T00:00:00`;
}
