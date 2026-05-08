export const AVATAR_MAX_BYTES = 200_000;

export const readFileAsDataUrl = (file: File): Promise<string> => {
  if (!file.type.startsWith('image/')) {
    return Promise.reject(new Error('Please choose an image file.'));
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return Promise.reject(
      new Error('Image must be smaller than 200 KB.')
    );
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Could not read the file.'));
        return;
      }
      resolve(result);
    };
    reader.readAsDataURL(file);
  });
};
