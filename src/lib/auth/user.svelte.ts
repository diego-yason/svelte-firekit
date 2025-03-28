/**
 * @module FirekitUser
 */
import { firebaseService } from "../firebase.js";
import { onAuthStateChanged, updateEmail, updatePassword, updateProfile, type User } from "firebase/auth";

/**
 * FirekitUser provides a singleton class for managing Firebase authentication state and user operations.
 * Implements state management using SvelteKit's $state and $derived.
 * 
 * @class
 * @example
 * ```typescript
 * // Get instance and check auth state
 * const auth = firekitUser;
 * if (auth.isLoggedIn) {
 *   console.log(auth.user);
 * }
 * 
 * // Update user profile
 * await auth.updateDisplayName("John Doe");
 * await auth.updatePhotoURL("https://example.com/photo.jpg");
 * ```
 */
class FirekitUser {
    private static instance: FirekitUser;

    /** @private Current user object state */
    private _user: User | undefined = $state();
    /** @private Authentication initialization state */
    private _initialized: undefined | boolean = $state();
    /** @private User login state */
    private _isLoggedIn: undefined | boolean = $state();

    /** Current user's UID */
    readonly uid = $derived(this._user?.uid);
    /** Current user's email */
    readonly email = $derived(this._user?.email);
    /** Current user's display name */
    readonly displayName = $derived(this._user?.displayName);
    /** Current user's photo URL */
    readonly photoURL = $derived(this._user?.photoURL);
    /** Whether current user's email is verified */
    readonly emailVerified = $derived(this._user?.emailVerified);

    /**
     * Private constructor that initializes auth state listener
     * @private
     */
    private constructor() {
        const auth = firebaseService.getAuthInstance();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this._user = user;
                this._isLoggedIn = true;
                this._initialized = true;
            } else {
                this._isLoggedIn = false;
                this._initialized = true;
            }
        });
    }

    /**
     * Gets the singleton instance of FirekitUser
     * @returns {FirekitUser} The FirekitUser instance
     */
    static getInstance(): FirekitUser {
        if (!FirekitUser.instance) {
            FirekitUser.instance = new FirekitUser();
        }
        return FirekitUser.instance;
    }

    /**
     * Gets the current Firebase user object
     * @returns {User | undefined} The current user or undefined if not logged in
     */
    get user(): User | undefined {
        return this._user;
    }

    /**
     * Checks if the Firebase Auth state has been initialized
     * @returns {boolean | undefined} True if initialized, undefined if pending
     */
    get initialized(): boolean | undefined {
        return this._initialized;
    }

    /**
     * Checks if a user is currently logged in
     * @returns {boolean | undefined} True if logged in, false if not, undefined if pending
     */
    get isLoggedIn(): boolean | undefined {
        return this._isLoggedIn;
    }

    /**
     * Updates the user's email address
     * @param {string} email - The new email address
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updateEmailUser("new@email.com");
     * ```
     */
    async updateEmailUser(email: string) {
        if (!this._user) throw new Error("No authenticated user");
        await updateEmail(this._user, email);
    }

    /**
     * Updates the user's password
     * @param {string} password - The new password
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updatePassword("newPassword123");
     * ```
     */
    async updatePassword(password: string) {
        if (!this._user) throw new Error("No authenticated user");
        await updatePassword(this._user, password);
    }

    /**
     * Updates the user's display name
     * @param {string} displayName - The new display name
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updateDisplayName("John Doe");
     * ```
     */
    async updateDisplayName(displayName: string) {
        if (!this._user) throw new Error("No authenticated user");
        await updateProfile(this._user, { displayName });
    }

    /**
     * Updates the user's profile photo URL
     * @param {string} photoURL - The new photo URL
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updatePhotoURL("https://example.com/photo.jpg");
     * ```
     */
    async updatePhotoURL(photoURL: string) {
        if (!this._user) throw new Error("No authenticated user");
        await updateProfile(this._user, { photoURL });
    }
}

/**
 * Pre-initialized singleton instance of FirekitUser.
 * Use this to access auth state and user operations.
 * 
 * @const
 * @type {FirekitUser}
 */
export const firekitUser = FirekitUser.getInstance();