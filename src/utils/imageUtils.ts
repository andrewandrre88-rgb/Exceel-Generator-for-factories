/**
 * Helper to convert files or image URLs to clean base64 for Excel embedding and previews
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Resize and compress image to keep Excel file size optimal (e.g. max 500x500px, JPEG 0.85)
 */
export async function compressImage(dataUrl: string, maxDim: number = 400): Promise<{ base64: string; extension: 'png' | 'jpeg' }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // white background for transparent pngs
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }

      const compressedJpeg = canvas.toDataURL('image/jpeg', 0.85);
      const cleanBase64 = compressedJpeg.replace(/^data:image\/[a-z]+;base64,/, '');
      resolve({
        base64: cleanBase64,
        extension: 'jpeg',
      });
    };
    img.onerror = () => {
      // Fallback
      const isPng = dataUrl.startsWith('data:image/png');
      const clean = dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      resolve({
        base64: clean,
        extension: isPng ? 'png' : 'jpeg',
      });
    };
    img.src = dataUrl;
  });
}
