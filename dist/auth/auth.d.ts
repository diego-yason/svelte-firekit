/**
 * @module FirekitAuth
 */
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
declare class FirekitAuth {
    private static instance;
    private auth;
    private firestore;
    private constructor();
    /**
     * Gets singleton instance of FirekitAuth
     * @returns {FirekitAuth} The FirekitAuth instance
     */
    static getInstance(): FirekitAuth;
    /**
     * Initiates Google sign-in popup and updates user data in Firestore
     * @throws {Error} If sign-in fails
     */
    signInWithGoogle(): Promise<void>;
    /**
     * Signs in user with email and password
     * @param {string} email User's email
     * @param {string} password User's password
     * @throws {Error} If sign-in fails
     */
    signInWithEmail(email: string, password: string): Promise<void>;
    /**
     * Sends an email with a login link to the user.
     * @param email User's email
     * @param redirectUrl URL to redirect to after clicking. Must be authorized domain in Firebase settings.
     */
    signInWithEmailLink(email: string, redirectUrl: string): Promise<void>;
    /**
     * Registers new user with email and password
     * @param {string} email User's email
     * @param {string} password User's password
     * @param {string} displayName User's display name
     * @throws {Error} If registration fails
     */
    registerWithEmail(email: string, password: string, displayName: string): Promise<void>;
    /**
     * Updates user data in Firestore
     * @param {User} user Firebase user object
     * @private
     */
    private updateUserInFirestore;
    /**
     * Signs out current user
     * @throws {Error} If sign-out fails
     */
    logOut(): Promise<void>;
    /**
     * Sends password reset email
     * @param {string} email User's email
     * @throws {Error} If sending reset email fails
     */
    sendPasswordReset(email: string): Promise<void>;
    /**
     * Sends email verification to current user
     * @throws {Error} If sending verification fails
     */
    sendEmailVerificationToUser(): Promise<void>;
    /**
     * Updates user profile data
     * @param {Object} profile Profile update data
     * @param {string} [profile.displayName] New display name
     * @param {string} [profile.photoURL] New photo URL
     * @throws {Error} If update fails
     */
    updateUserProfile(profile: {
        displayName?: string;
        photoURL?: string;
    }): Promise<void>;
    /**
     * Updates user password with reauthentication
     * @param {string} newPassword New password
     * @param {string} currentPassword Current password for reauthentication
     * @returns {Promise<{success: boolean, message: string, code?: string}>} Update result
     */
    updateUserPassword(newPassword: string, currentPassword: string): Promise<{
        success: boolean;
        message: string;
        code?: undefined;
    } | {
        success: boolean;
        code: any;
        message: string;
    }>;
    /**
     * Reauthenticates current user
     * @param {string} currentPassword Current password
     * @throws {Error} If reauthentication fails
     * @private
     */
    private reauthenticateUser;
    /**
     * Deletes user account and associated data
     * @returns {Promise<{success: boolean, message: string}>} Deletion result
     * @throws {Error} If deletion fails
     */
    deleteUserAccount(): Promise<{
        success: boolean;
        message: string;
    }>;
}
/**
 * Pre-initialized singleton instance of FirekitAuth
 * @const
 * @type {FirekitAuth}
 */
export declare const firekitAuth: FirekitAuth;
export {};
