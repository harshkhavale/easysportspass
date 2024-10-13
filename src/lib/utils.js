import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export const getInitials = name => {
  const words = name?.split(' ');

  // Get the initial letter of the first word
  const firstInitial = name ? words[0]?.charAt(0) : [];

  // Get the initial letter of the last word
  const lastInitial = words[words.length - 1]?.charAt(0);

  // Combine the initial letters
  const initials = firstInitial + lastInitial;

  return initials;
};

export async function getBase64ImageFromURL(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
}

export function base64UrlToBlob(base64Url, defaultFileName = 'file') {
  const byteString = atob(base64Url.split(',')[1]); // Decode Base64 string
  const mimeString = base64Url.split(',')[0].split(':')[1].split(';')[0]; // Extract MIME type
  const ab = new ArrayBuffer(byteString.length); // Create a new ArrayBuffer
  const ia = new Uint8Array(ab); // Create a new Uint8Array from the ArrayBuffer

  // Populate the Uint8Array with the byte string
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString }); // Create a Blob from the Uint8Array
  const fileName = `${defaultFileName}.${mimeString.split('/')[1]}`; // Derive file name from MIME type

  return { blob, fileName }; // Return an object containing the Blob and file name
}

export function blobToFile(blob, fileName) {
  return new File([blob], fileName, { type: blob.type }); // Create and return a File object
}

export const phoneRegExp = /^[6-9]\d{9}$/;
