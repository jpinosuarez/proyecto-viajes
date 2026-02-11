const DEFAULT_MAX_SIZE_BYTES = 500 * 1024;
const MIN_QUALITY = 0.55;
const MIN_WIDTH = 960;

const readFileAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
    reader.readAsDataURL(file);
  });

const createImageFromDataURL = (dataUrl) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo decodificar la imagen.'));
    img.src = dataUrl;
  });

const canvasToBlob = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo exportar la imagen comprimida.'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      quality
    );
  });

export const compressImage = async (file, maxWidth = 1920, quality = 0.8) => {
  if (!(file instanceof File || file instanceof Blob)) {
    throw new Error('El archivo de imagen no es valido.');
  }

  const dataUrl = await readFileAsDataURL(file);
  const img = await createImageFromDataURL(dataUrl);

  const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
  let targetWidth = Math.round(img.width * ratio);
  let targetHeight = Math.round(img.height * ratio);
  let currentQuality = quality;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el canvas para comprimir la imagen.');
  }

  let compressedBlob = null;

  while (true) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    compressedBlob = await canvasToBlob(canvas, currentQuality);
    const meetsSizeTarget = compressedBlob.size <= DEFAULT_MAX_SIZE_BYTES;
    const canLowerQuality = currentQuality > MIN_QUALITY;
    const canReduceDimensions = targetWidth > MIN_WIDTH;

    if (meetsSizeTarget || (!canLowerQuality && !canReduceDimensions)) break;

    if (canLowerQuality) {
      currentQuality = Math.max(MIN_QUALITY, Number((currentQuality - 0.08).toFixed(2)));
      continue;
    }

    targetWidth = Math.max(MIN_WIDTH, Math.round(targetWidth * 0.9));
    targetHeight = Math.max(1, Math.round((img.height / img.width) * targetWidth));
  }

  const optimizedDataUrl = await readFileAsDataURL(compressedBlob);

  return {
    blob: compressedBlob,
    dataUrl: optimizedDataUrl,
    width: targetWidth,
    height: targetHeight,
    size: compressedBlob.size,
    quality: currentQuality
  };
};

