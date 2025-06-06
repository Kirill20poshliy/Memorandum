import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  updateDoc,
  deleteDoc,
  DocumentReference,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import userStore from "./userStore";
import { db } from "../../firebase/firebase.config";
import { makeAutoObservable, runInAction } from "mobx";
import type { INote } from "@shared/models/note";

class NotesStore {
    userNotes: INote[] = [];
    isLoading: boolean = false;
    isItemLoading: boolean = false;
    isSaving: boolean = false
    currentNote: INote | null = null;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async createNote(): Promise<INote> {
        if (!userStore.currentUser) {
            runInAction(() => {
                this.error = "User not authenticated";
            });
            throw new Error("User not authenticated");
        }

        const noteData: Omit<INote, 'id' | 'createdAt' | 'user_id'> = {
            title: "Новая заметка",
            text: ""
        }

        runInAction(() => {
            this.isItemLoading = true;
            this.error = null;
        });

        try {
            const userRef = doc(db, "users", userStore.currentUser.uid);
            
            const docRef = await addDoc(collection(db, 'notes'), {
                ...noteData,
                user_id: userRef,
                createdAt: serverTimestamp()
            });

            const docSnap = await getDoc(docRef);
            const newNote = {
                id: docRef.id,
                ...docSnap.data() as Omit<INote, 'id'>
            };

            runInAction(() => {
                this.userNotes.unshift(newNote);
                this.isItemLoading = false;
            });

            return newNote;
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to create note";
                this.isItemLoading = false;
                console.error("Error creating note: ", error);
            });
            throw error;
        }
    }

    async fetchUserNotes() {
        if (!userStore.currentUser) {
            runInAction(() => {
                this.error = "User not authenticated";
                this.isLoading = false;
            });
            throw new Error("User not authenticated");
        }

        runInAction(() => {
            this.isLoading = true;
            this.error = null;
        });

        try {
            const userRef = doc(db, "users", userStore.currentUser.uid);
            const q = query(
                collection(db, 'notes'),
                where("user_id", "==", userRef)
            );
      
            const querySnapshot = await getDocs(q);
      
            runInAction(() => {
                this.userNotes = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }) as INote);
                this.isLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to fetch notes";
                this.isLoading = false;
                console.error("Error getting notes: ", error);
            });
            throw error;
        }
    }

    async fetchNoteById(noteId: string): Promise<INote> {
        if (!userStore.currentUser) {
            runInAction(() => {
                this.error = "User not authenticated";
            });
            throw new Error("User not authenticated");
        }

        runInAction(() => {
            this.isItemLoading = true;
            this.error = null;
        });

        try {
            const noteRef = doc(db, "notes", noteId);
            const noteSnap = await getDoc(noteRef);

            if (!noteSnap.exists()) {
                throw new Error("Note not found");
            }

            const noteData = {
                id: noteSnap.id,
                ...noteSnap.data()
            } as INote;

            const userRef = doc(db, "users", userStore.currentUser.uid);
            if ((noteData.user_id as unknown as DocumentReference).id !== userRef.id) {
                throw new Error("Unauthorized access to note");
            }

            runInAction(() => {
                this.currentNote = noteData;
                this.isItemLoading = false;
            });

            return noteData;
        } catch (error) {
            runInAction(() => {
                this.error = error instanceof Error ? error.message : "Failed to fetch note";
                this.isItemLoading = false;
            });
            throw error;
        }
    }

    async updateNote(noteId: string): Promise<void> {
        if (!userStore.currentUser) {
            runInAction(() => {
                this.error = "User not authenticated";
            });
            throw new Error("User not authenticated");
        }

        runInAction(() => {
            this.isSaving = true;
            this.error = null;
        });

        if (this.currentNote) {
            try {
                const noteRef = doc(db, "notes", noteId);
                const updates = {
                    title: this.currentNote.title ? this.currentNote.title : "Новая заметка", 
                    text: this.currentNote.text
                }
                await updateDoc(noteRef, updates);
    
                runInAction(() => {
                    this.userNotes = this.userNotes.map(note => 
                        note.id === noteId ? { ...note, ...updates } : note
                    );
                    if (this.currentNote?.id === noteId) {
                        this.currentNote = { ...this.currentNote, ...updates };
                    }
                    this.isSaving = false;
                });
            } catch (error) {
                runInAction(() => {
                    this.error = "Failed to update note";
                    this.isSaving = false;
                    console.error("Error updating note: ", error);
                });
                throw error;
            }

        }

    }

    async deleteNote(noteId: string): Promise<void> {
        if (!userStore.currentUser) {
            runInAction(() => {
                this.error = "User not authenticated";
            });
            throw new Error("User not authenticated");
        }

        runInAction(() => {
            this.isItemLoading = true;
            this.error = null;
        });

        try {
            const noteRef = doc(db, "notes", noteId);
            await deleteDoc(noteRef);

            runInAction(() => {
                this.userNotes = this.userNotes.filter(note => note.id !== noteId);
                if (this.currentNote?.id === noteId) {
                    this.currentNote = null;
                }
                this.isItemLoading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = "Failed to delete note";
                this.isItemLoading = false;
                console.error("Error deleting note: ", error);
            });
            throw error;
        }
    }

    resetCurrentNote() {
        this.currentNote = null;
    }

    resetError() {
        this.error = null;
    }

    get getUserNotes() {
        return this.userNotes;
    }

    get getCurrentNote() {
        return this.currentNote;
    }

    changeTitle(value: string) {
        if (this.currentNote) {
            this.currentNote = {
                ...this.currentNote,
                title: value
            }
        }
    }

    changeText(value: string) {
        if (this.currentNote) {
            this.currentNote = {
                ...this.currentNote,
                text: value
            }
        }
    }
}

export default new NotesStore();