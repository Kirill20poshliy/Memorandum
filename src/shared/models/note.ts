import type { Timestamp } from "firebase/firestore";

export interface INote {
    id: string,
    title: string,
    text: string,
    createdAt: Timestamp,
    user_id: string,
}