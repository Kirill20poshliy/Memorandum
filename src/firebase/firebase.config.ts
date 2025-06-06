import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyA3eGSC4wSy0oxwJPoIrGT_IgE3BCwSlbI",
    authDomain: "memorandum-ea931.firebaseapp.com",
    projectId: "memorandum-ea931",
    storageBucket: "memorandum-ea931.firebasestorage.app",
    messagingSenderId: "61834177580",
    appId: "1:61834177580:web:800fb7a3ebb2b252943589"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;