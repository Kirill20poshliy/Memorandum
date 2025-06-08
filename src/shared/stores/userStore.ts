import { makeAutoObservable, runInAction } from 'mobx';
import { auth, googleProvider, db } from '../../firebase/firebase.config';
import { 
    type User, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp, 
    Timestamp
} from 'firebase/firestore';
import type { IUserProfile } from '@shared/models/user';
import { message } from 'antd';

class UserStore {
    currentUser: User | null = null;
    userProfile: IUserProfile | null = null;
    isLoading = true;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.initAuthListener();
    }

    initAuthListener() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await this.handleUserAuth(user);
            } else {
                runInAction(() => {
                    this.currentUser = null;
                    this.userProfile = null;
                    this.isLoading = false;
                });
            }
        });
    }

    async handleUserAuth(user: User) {
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            let profileData: IUserProfile;

            if (userDoc.exists()) {
                profileData = userDoc.data() as IUserProfile;
                await setDoc(
                    userDocRef, 
                    {
                        lastLogin: serverTimestamp()
                    }, 
                    { 
                        merge: true 
                    }
                );
            } else {
                profileData = {
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp() as Timestamp
                };
                await setDoc(userDocRef, profileData);
            }

            runInAction(() => {
                this.currentUser = user;
                this.userProfile = profileData;
                this.isLoading = false;
                this.error = null;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to authenticate user';
                this.isLoading = false;
                console.error('Auth error:', error);
            });
        }
  }

    async signInWithGoogle() {
        try {
            this.isLoading = true;
            const result = await signInWithPopup(auth, googleProvider);
            await this.handleUserAuth(result.user);
        } catch (error) {
            runInAction(() => {
                this.error = 'Google sign in failed';
                this.isLoading = false;
                message.error("Ошибка при входе. Попробуйте позже!")
                console.error('Google sign in error:', error);
            });
        }
    }

    async logout() {
        try {
            await signOut(auth);
            runInAction(() => {
                this.currentUser = null;
                this.userProfile = null;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Logout failed';
                message.error("Не удалось выйти...")
                console.error('Logout error:', error);
            });
        }
    }

    get isAuthenticated() {
        return !!this.currentUser;
    }
}

export default new UserStore();