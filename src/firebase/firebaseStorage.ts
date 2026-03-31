
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