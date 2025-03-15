/**
 * @module FirekitDoc
 */
import { DocumentReference } from "firebase/firestore";
/**
 * Manages real-time Firestore document subscriptions with reactive state
 * @class
 * @template T Document data type
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * // Create document subscription
 * const userDoc = firekitDoc<User>('users/123', {
 *   id: '123',
 *   name: 'Loading...',
 *   email: ''
 * });
 * ```
 */
declare class FirekitDoc<T> {
    /** Current document data */
    private _data;
    /** Loading state */
    private _loading;
    /** Error state */
    private _error;
    /** Document reference */
    private docRef;
    /**
     * Creates a document subscription
     * @param {string | DocumentReference<T>} ref Document path or reference
     * @param {T} [startWith] Initial data before fetch completes
     *
     * @example
     * ```typescript
     * const doc = new FirekitDoc('users/123', defaultUser);
     * // or
     * const doc = new FirekitDoc(docRef, defaultUser);
     * ```
     */
    constructor(ref: string | DocumentReference<T>, startWith?: T);
    /** Gets current document data */
    get data(): T | null;
    /** Gets document ID */
    get id(): string;
    /** Gets loading state */
    get loading(): boolean;
    /** Gets error state */
    get error(): Error | null;
    /**
     * Gets document reference
     * @throws {Error} If document reference is not available
     */
    get ref(): DocumentReference<T>;
    /** Checks if document exists */
    get exists(): boolean;
}
/**
 * Creates a document subscription
 * @template T Document data type
 * @param {string | DocumentReference<T>} ref Document path or reference
 * @param {T} [startWith] Initial data before fetch completes
 * @returns {FirekitDoc<T>} Document subscription instance
 *
 * @example
 * ```typescript
 * const userDoc = firekitDoc<User>('users/123', {
 *   id: '123',
 *   name: 'Loading...',
 *   email: ''
 * });
 *
 * // Access reactive state
 * if (userDoc.loading) {
 *   console.log('Loading...');
 * } else if (userDoc.error) {
 *   console.error(userDoc.error);
 * } else if (userDoc.exists) {
 *   console.log(userDoc.data);
 * }
 * ```
 */
export declare function firekitDoc<T>(ref: string | DocumentReference<T>, startWith?: T): FirekitDoc<T>;
export {};
