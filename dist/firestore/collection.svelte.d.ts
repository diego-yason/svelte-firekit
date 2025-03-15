/**
 * @module FirekitCollection
 */
import { type CollectionReference, type DocumentData, type QueryConstraint } from "firebase/firestore";
/**
 * Manages real-time Firestore collection subscriptions with reactive state
 * @class
 * @template T Collection document type
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * // Create collection subscription
 * const users = firekitCollection<User>('users',
 *   where('active', '==', true),
 *   orderBy('name')
 * );
 *
 * // Access reactive state
 * console.log(users.data);    // Array of documents
 * console.log(users.loading); // Loading state
 * console.log(users.error);   // Error state
 * console.log(users.empty);   // Whether collection is empty
 * console.log(users.size);    // Number of documents
 * ```
 */
declare class FirekitCollection<T> {
    /** Current collection data */
    private _data;
    /** Loading state */
    private _loading;
    /** Error state */
    private _error;
    /** Collection reference */
    private colRef;
    /** Query reference */
    private queryRef;
    /**
     * Creates a collection subscription
     * @param {string} path Collection path
     * @param {...QueryConstraint[]} queryConstraints Query constraints (where, orderBy, limit, etc.)
     *
     * @example
     * ```typescript
     * const collection = new FirekitCollection('users',
     *   where('age', '>=', 18),
     *   orderBy('name', 'asc'),
     *   limit(10)
     * );
     * ```
     */
    constructor(path: string, ...queryConstraints: QueryConstraint[]);
    /** Gets current collection data */
    get data(): T[];
    /** Gets loading state */
    get loading(): boolean;
    /** Gets error state */
    get error(): Error | null;
    /** Checks if collection is empty */
    get empty(): boolean;
    /** Gets number of documents in collection */
    get size(): number;
    /**
     * Gets collection reference
     * @throws {Error} If collection reference is not available
     */
    get ref(): CollectionReference<T>;
}
/**
 * Creates a collection subscription
 * @template T Collection document type
 * @param {string} path Collection path
 * @param {...QueryConstraint[]} queryConstraints Query constraints
 * @returns {FirekitCollection<T>} Collection subscription instance
 *
 * @example
 * ```typescript
 * interface Post {
 *   id: string;
 *   title: string;
 *   authorId: string;
 * }
 *
 * const posts = firekitCollection<Post>('posts',
 *   where('authorId', '==', currentUserId),
 *   orderBy('createdAt', 'desc')
 * );
 * ```
 */
export declare function firekitCollection<T extends DocumentData>(path: string, ...queryConstraints: QueryConstraint[]): FirekitCollection<T>;
export {};
