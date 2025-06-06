import type { Timestamp } from "firebase/firestore";

export interface IUserProfile {
    uid: string;
    email: string | null;
    name: string | null;
    photoURL: string | null;
    createdAt: Timestamp;
}
