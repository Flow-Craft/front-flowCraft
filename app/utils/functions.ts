export function separarNombreCompleto(nombreCompleto: string) {
  const partes = nombreCompleto.trim().split(' ');

  if (partes.length === 2) {
    // Caso: "Mario Merida"
    return {
      Nombre: partes[0],
      Apellido: partes[1],
    };
  } else if (partes.length === 3) {
    // Caso: "Mario Merida Correa"
    return {
      Nombre: partes[0],
      Apellido: `${partes[1]} ${partes[2]}`,
    };
  } else {
    // Caso: "José María Lopez Rodriguez" o más de 3 palabras
    return {
      Nombre: `${partes[0]} ${partes[1]}`,
      Apellido: partes.slice(2).join(' '),
    };
  }
}
