/**
 * @module FirekitAwaitableDoc
 */
import { type DocumentReference, type DocumentData } from "firebase/firestore";
/**
 * Provides real-time document subscription with state management.
 * Automatically handles document data updates, loading states, and error handling.
 *
 * @class
 * @template T Type of document data
 * @example
 * ```typescript
 * interface UserProfile {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * // Create document subscription
 * const userDoc = firekitAwaitableDoc<UserProfile>(
 *   'users/123',
 *   { id: '123', name: 'Loading...', email: '' }
 * );
 *
 * // Access reactive state
 * if (userDoc.loading) {
 *   console.log('Loading user data...');
 * } else if (userDoc.error) {
 *   console.error('Error:', userDoc.error);
 * } else {
 *   console.log('User data:', userDoc.data);
 * }
 *
 * // Get fresh data
 * const freshData = await userDoc.getData();
 * ```
 */
declare class FirekitAwaitableDoc<T> {
    /**
     * Current document data.
     * Uses SvelteKit's $state for reactivity.
     * @private
     */
    private _data;
    /**
     * Loading state indicator.
     * Uses SvelteKit's $state for reactivity.
     * @private
     */
    private _loading;
    /**
     * Error state container.
     * Uses SvelteKit's $state for reactivity.
     * @private
     */
    private _error;
    /**
     * Firestore document reference.
     * @private
     */
    private docRef;
    /**
     * Creates a document subscription.
     * Initializes document subscription if in browser environment.
     *
     * @param {string | DocumentReference<T>} ref - Document path or reference
     * @param {T} [startWith] - Initial data before fetch completes
     *
     * @example
     * ```typescript
     * const doc = new FirekitAwaitableDoc('users/123', defaultUser);
     * ```
     */
    constructor(ref: string | DocumentReference<T>, startWith?: T);
    /**
     * Initializes document subscription.
     * Sets up real-time updates and handles initial data fetch.
     *
     * @private
     * @param {string | DocumentReference<T>} ref - Document path or reference
     * @returns {Promise<void>}
     *
     * @throws {Error} If document initialization fails
     */
    private initializeDoc;
    /**
     * Fetches fresh document data.
     * Makes a new request to Firestore instead of using cached data.
     *
     * @returns {Promise<T | null>} Document data or null if not found
     *
     * @example
     * ```typescript
     * const freshData = await doc.getData();
     * if (freshData) {
     *   console.log('Fresh data:', freshData);
     * }
     * ```
     */
    getData(): Promise<T | null>;
    /**
     * Gets current document data.
     * @returns {T | null} Current document data or null if not loaded
     */
    get data(): T | null;
    /**
     * Gets current loading state.
     * @returns {boolean} True if document is loading
     */
    get loading(): boolean;
    /**
     * Gets current error state.
     * @returns {Error | null} Error object if an error occurred, null otherwise
     */
    get error(): Error | null;
}
/**
 * Creates a document subscription.
 * Factory function for creating FirekitAwaitableDoc instances.
 *
 * @template T Document data type
 * @param {string} path Document path
 * @param {T} [startWith] Initial data before fetch completes
 * @returns {FirekitAwaitableDoc<T>} Document subscription instance
 *
 * @example
 * ```typescript
 * interface UserProfile {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * const userDoc = firekitAwaitableDoc<UserProfile>(
 *   'users/123',
 *   { id: '123', name: 'Loading...', email: '' }
 * );
 * ```
 */
export declare function firekitAwaitableDoc<T extends DocumentData>(path: string, startWith?: T): FirekitAwaitableDoc<T>;
export {};
