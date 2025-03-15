/**
 * @module FirekitAuth
 */

import {
	GoogleAuthProvider,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
	updatePassword,
	type User,
	EmailAuthProvider,
	reauthenticateWithCredential,
	signInWithEmailLink
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { firebaseService } from '../firebase.js';
import { firekitDocMutations } from '../firestore/document-mutations.svelte.js';

/**
 * Manages Firebase authentication operations including sign-in, registration, and profile management.
 * @class
 * @example
 * ```typescript
 * // Sign in with Google
 * await firekitAuth.signInWithGoogle();
 *
 * // Register new user
 * await firekitAuth.registerWithEmail("user@example.com", "password123", "John Doe");
 * ```
 */
class FirekitAuth {
	private static instance: FirekitAuth;
	private auth = firebaseService.getAuthInstance();
	private firestore = firebaseService.getDbInstance();

	private constructor() {}

	/**
	 * Gets singleton instance of FirekitAuth
	 * @returns {FirekitAuth} The FirekitAuth instance
	 */
	static getInstance(): FirekitAuth {
		if (!FirekitAuth.instance) {
			FirekitAuth.instance = new FirekitAuth();
		}
		return FirekitAuth.instance;
	}

	/**
	 * Initiates Google sign-in popup and updates user data in Firestore
	 * @throws {Error} If sign-in fails
	 */
	async signInWithGoogle(): Promise<void> {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(this.auth, provider);
		await this.updateUserInFirestore(result.user);
	}

	/**
	 * Signs in user with email and password
	 * @param {string} email User's email
	 * @param {string} password User's password
	 * @throws {Error} If sign-in fails
	 */
	async signInWithEmail(email: string, password: string): Promise<void> {
		const result = await signInWithEmailAndPassword(this.auth, email, password);
		await this.updateUserInFirestore(result.user);
	}

	/**
	 * Sends an email with a login link to the user.
	 * @param email User's email
	 * @param redirectUrl URL to redirect to after clicking. Must be authorized domain in Firebase settings.
	 */
	async signInWithEmailLink(email: string, redirectUrl: string): Promise<void> {
		await signInWithEmailLink(this.auth, email, redirectUrl);
	}

	/**
	 * Registers new user with email and password
	 * @param {string} email User's email
	 * @param {string} password User's password
	 * @param {string} displayName User's display name
	 * @throws {Error} If registration fails
	 */
	async registerWithEmail(email: string, password: string, displayName: string): Promise<void> {
		const result = await createUserWithEmailAndPassword(this.auth, email, password);
		const user = result.user;
		if (user) {
			await updateProfile(user, { displayName });
			await this.updateUserInFirestore(user);
			await sendEmailVerification(user);
		}
	}

	/**
	 * Updates user data in Firestore
	 * @param {User} user Firebase user object
	 * @private
	 */
	private async updateUserInFirestore(user: User): Promise<void> {
		const ref = doc(this.firestore, 'users', user.uid);
		const userData = {
			uid: user.uid,
			email: user.email,
			emailVerified: user.emailVerified,
			displayName: user.displayName,
			photoURL: user.photoURL,
			isAnonymous: user.isAnonymous,
			providerId: user.providerId,
			providerData: user.providerData
		};
		await setDoc(ref, userData, { merge: true });
	}

	/**
	 * Signs out current user
	 * @throws {Error} If sign-out fails
	 */
	async logOut(): Promise<void> {
		await signOut(this.auth);
	}

	/**
	 * Sends password reset email
	 * @param {string} email User's email
	 * @throws {Error} If sending reset email fails
	 */
	async sendPasswordReset(email: string): Promise<void> {
		await sendPasswordResetEmail(this.auth, email);
	}

	/**
	 * Sends email verification to current user
	 * @throws {Error} If sending verification fails
	 */
	async sendEmailVerificationToUser(): Promise<void> {
		if (this.auth.currentUser) {
			await sendEmailVerification(this.auth.currentUser);
		}
	}

	/**
	 * Updates user profile data
	 * @param {Object} profile Profile update data
	 * @param {string} [profile.displayName] New display name
	 * @param {string} [profile.photoURL] New photo URL
	 * @throws {Error} If update fails
	 */
	async updateUserProfile(profile: { displayName?: string; photoURL?: string }): Promise<void> {
		if (this.auth.currentUser) {
			await updateProfile(this.auth.currentUser, profile);
			await this.updateUserInFirestore(this.auth.currentUser);
		}
	}

	/**
	 * Updates user password with reauthentication
	 * @param {string} newPassword New password
	 * @param {string} currentPassword Current password for reauthentication
	 * @returns {Promise<{success: boolean, message: string, code?: string}>} Update result
	 */
	async updateUserPassword(newPassword: string, currentPassword: string) {
		if (!this.auth.currentUser) {
			throw new Error('No authenticated user found.');
		}

		try {
			await this.reauthenticateUser(currentPassword);
			await updatePassword(this.auth.currentUser, newPassword);
			return { success: true, message: 'Password successfully updated.' };
		} catch (error: any) {
			if (error.code === 'auth/wrong-password') {
				return {
					success: false,
					code: error.code,
					message: 'Reauthentication failed: incorrect password.'
				};
			}
			return {
				success: false,
				code: error.code || 'unknown_error',
				message: `Failed to update password: ${error.message || 'Unknown error occurred.'}`
			};
		}
	}

	/**
	 * Reauthenticates current user
	 * @param {string} currentPassword Current password
	 * @throws {Error} If reauthentication fails
	 * @private
	 */
	private async reauthenticateUser(currentPassword: string) {
		if (!this.auth.currentUser || !this.auth.currentUser.email) {
			throw new Error('No authenticated user or email unavailable.');
		}

		const credential = EmailAuthProvider.credential(this.auth.currentUser.email, currentPassword);

		try {
			await reauthenticateWithCredential(this.auth.currentUser, credential);
		} catch (error: any) {
			throw new Error(`Reauthentication failed: ${error.message || 'Unknown error occurred.'}`);
		}
	}

	/**
	 * Deletes user account and associated data
	 * @returns {Promise<{success: boolean, message: string}>} Deletion result
	 * @throws {Error} If deletion fails
	 */
	async deleteUserAccount(): Promise<{ success: boolean; message: string }> {
		if (!this.auth.currentUser) {
			throw new Error('No authenticated user found.');
		}

		try {
			firekitDocMutations.delete(`users/${this.auth.currentUser.uid}`);
			await this.auth.currentUser.delete();
			return { success: true, message: 'Account successfully deleted.' };
		} catch (error: any) {
			throw new Error(error.message);
		}
	}
}

/**
 * Pre-initialized singleton instance of FirekitAuth
 * @const
 * @type {FirekitAuth}
 */
export const firekitAuth = FirekitAuth.getInstance();
