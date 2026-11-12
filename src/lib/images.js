/**
 * Lee una imagen, la reduce a 900 px por lado y la devuelve como data URL JPEG.
 * Se reduce para que quepa en localStorage; con un backend real se subiría el archivo original.
 */
export function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('La imagen no se pudo abrir'));
      img.onload = () => {
        const k = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * k));
        canvas.height = Math.max(1, Math.round(img.height * k));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
