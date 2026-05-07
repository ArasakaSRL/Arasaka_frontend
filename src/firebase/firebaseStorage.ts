
import { storage } from "./config"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


type ProgressCallback = (progress: number) => void;


export const uploadImage = (
  file: File,
  path: string,
  onProgress?: ProgressCallback
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(prog);
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => resolve(url))
          .catch((err) => reject(err));
      }
    );
  });
};


export const getImageUrl = async (path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  return await getDownloadURL(storageRef);
};

export const uploadMultipleImages = async (files: File[]) => {
  if (!files.length) {
    throw new Error("No se han proporcionado archivos para subir.");
  }

  return await Promise.all(
    files.map((file, index) => {
      if (!file.type.startsWith("image/")) {
        throw new Error(`Archivo inválido: ${file.name}`);
      }

      const cleanName = file.name.replace(/\s+/g, "_");
      const path = `proyectos/${Date.now()}_${index}_${cleanName}`;

      return uploadImage(file, path);
    })
  );
};