import { type User } from "firebase/auth";
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
declare class FirekitUser {
    private static instance;
    /** @private Current user object state */
    private _user;
    /** @private Authentication initialization state */
    private _initialized;
    /** @private User login state */
    private _isLoggedIn;
    /** Current user's UID */
    readonly uid: string | undefined;
    /** Current user's email */
    readonly email: string | null | undefined;
    /** Current user's display name */
    readonly displayName: string | null | undefined;
    /** Current user's photo URL */
    readonly photoURL: string | null | undefined;
    /** Whether current user's email is verified */
    readonly emailVerified: boolean | undefined;
    /**
     * Private constructor that initializes auth state listener
     * @private
     */
    private constructor();
    /**
     * Gets the singleton instance of FirekitUser
     * @returns {FirekitUser} The FirekitUser instance
     */
    static getInstance(): FirekitUser;
    /**
     * Gets the current Firebase user object
     * @returns {User | undefined} The current user or undefined if not logged in
     */
    get user(): User | undefined;
    /**
     * Checks if the Firebase Auth state has been initialized
     * @returns {boolean | undefined} True if initialized, undefined if pending
     */
    get initialized(): boolean | undefined;
    /**
     * Checks if a user is currently logged in
     * @returns {boolean | undefined} True if logged in, false if not, undefined if pending
     */
    get isLoggedIn(): boolean | undefined;
    /**
     * Updates the user's email address
     * @param {string} email - The new email address
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updateEmailUser("new@email.com");
     * ```
     */
    updateEmailUser(email: string): Promise<void>;
    /**
     * Updates the user's password
     * @param {string} password - The new password
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updatePassword("newPassword123");
     * ```
     */
    updatePassword(password: string): Promise<void>;
    /**
     * Updates the user's display name
     * @param {string} displayName - The new display name
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updateDisplayName("John Doe");
     * ```
     */
    updateDisplayName(displayName: string): Promise<void>;
    /**
     * Updates the user's profile photo URL
     * @param {string} photoURL - The new photo URL
     * @throws {Error} If no user is authenticated
     * @example
     * ```typescript
     * await firekitUser.updatePhotoURL("https://example.com/photo.jpg");
     * ```
     */
    updatePhotoURL(photoURL: string): Promise<void>;
}
/**
 * Pre-initialized singleton instance of FirekitUser.
 * Use this to access auth state and user operations.
 *
 * @const
 * @type {FirekitUser}
 */
export declare const firekitUser: FirekitUser;
export {};
