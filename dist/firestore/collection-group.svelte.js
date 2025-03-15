/**
 * @module FirekitCollectionGroup
 */
import { collectionGroup, query, onSnapshot } from "firebase/firestore";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";
/**
 * Manages real-time Firestore collection group subscriptions with reactive state
 * @class
 * @template T Collection document type
 *
 * @example
 * ```typescript
 * interface Task {
 *   id: string;
 *   title: string;
 *   status: string;
 * }
 *
 * // Create collection group subscription
 * const allTasks = firekitCollectionGroup<Task>('tasks',
 *   where('status', '==', 'active'),
 *   orderBy('title')
 * );
 * ```
 */
class FirekitCollectionGroup {
    /** Current collection group data */
    _data = $state([]);
    /** Loading state */
    _loading = $state(true);
    /** Error state */
    _error = $state(null);
    /** Query reference */
    queryRef = null;
    /**
     * Creates a collection group subscription
     * @param {string} collectionId Collection ID to query across all documents
     * @param {...QueryConstraint[]} queryConstraints Query constraints (where, orderBy, limit, etc.)
     */
    constructor(collectionId, ...queryConstraints) {
        if (browser) {
            try {
                const firestore = firebaseService.getDbInstance();
                const groupRef = collectionGroup(firestore, collectionId);
                this.queryRef = query(groupRef, ...queryConstraints);
                onSnapshot(this.queryRef, (snapshot) => {
                    this._data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        path: doc.ref.path,
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
    /** Gets current collection group data */
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
    /** Checks if collection group is empty */
    get empty() {
        return this._data.length === 0;
    }
    /** Gets number of documents in collection group */
    get size() {
        return this._data.length;
    }
    /**
     * Gets query reference
     * @throws {Error} If query reference is not available
     */
    get ref() {
        if (!this.queryRef) {
            throw new Error("Query reference is not available");
        }
        return this.queryRef;
    }
}
/**
 * Creates a collection group subscription
 * @template T Collection document type
 * @param {string} collectionId Collection ID to query across all documents
 * @param {...QueryConstraint[]} queryConstraints Query constraints
 * @returns {FirekitCollectionGroup<T>} Collection group subscription instance
 *
 * @example
 * ```typescript
 * interface Comment {
 *   id: string;
 *   text: string;
 *   userId: string;
 * }
 *
 * const allComments = firekitCollectionGroup<Comment>('comments',
 *   where('userId', '==', currentUserId),
 *   orderBy('createdAt', 'desc')
 * );
 * ```
 */
export function firekitCollectionGroup(collectionId, ...queryConstraints) {
    return new FirekitCollectionGroup(collectionId, ...queryConstraints);
}
