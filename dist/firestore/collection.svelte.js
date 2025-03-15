/**
 * @module FirekitCollection
 */
import { collection, query, onSnapshot } from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";
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
class FirekitCollection {
    /** Current collection data */
    _data = $state([]);
    /** Loading state */
    _loading = $state(true);
    /** Error state */
    _error = $state(null);
    /** Collection reference */
    colRef = null;
    /** Query reference */
    queryRef = null;
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
    constructor(path, ...queryConstraints) {
        if (browser) {
            try {
                const firestore = firebaseService.getDbInstance();
                this.colRef = collection(firestore, path);
                this.queryRef = query(this.colRef, ...queryConstraints);
                onSnapshot(this.queryRef, (snapshot) => {
                    this._data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    this._loading = false;
                    this._error = null;
                }, (error) => {
                    this._error = error;
                    this._loading = false;
                });
            }
            catch (error) {
                this._error = error;
                this._loading = false;
            }
        }
    }
    /** Gets current collection data */
    get data() {
        return this._data;
    }
    /** Gets loading state */
    get loading() {
        return this._loading;
    }
    /** Gets error state */
    get error() {
        return this._error;
    }
    /** Checks if collection is empty */
    get empty() {
        return this._data.length === 0;
    }
    /** Gets number of documents in collection */
    get size() {
        return this._data.length;
    }
    /**
     * Gets collection reference
     * @throws {Error} If collection reference is not available
     */
    get ref() {
        if (!this.colRef) {
            throw new Error("Collection reference is not available");
        }
        return this.colRef;
    }
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
export function firekitCollection(path, ...queryConstraints) {
    return new FirekitCollection(path, ...queryConstraints);
}
