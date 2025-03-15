/**
 * @module FirekitCollectionGroup
 */
import { type Query, type DocumentData, type QueryConstraint } from "firebase/firestore";
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
declare class FirekitCollectionGroup<T> {
    /** Current collection group data */
    private _data;
    /** Loading state */
    private _loading;
    /** Error state */
    private _error;
    /** Query reference */
    private queryRef;
    /**
     * Creates a collection group subscription
     * @param {string} collectionId Collection ID to query across all documents
     * @param {...QueryConstraint[]} queryConstraints Query constraints (where, orderBy, limit, etc.)
     */
    constructor(collectionId: string, ...queryConstraints: QueryConstraint[]);
    /** Gets current collection group data */
    get data(): T[];
    /** Gets loading state */
    get loading(): boolean;
    /** Gets error state */
    get error(): Error | null;
    /** Checks if collection group is empty */
    get empty(): boolean;
    /** Gets number of documents in collection group */
    get size(): number;
    /**
     * Gets query reference
     * @throws {Error} If query reference is not available
     */
    get ref(): Query<T>;
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
export declare function firekitCollectionGroup<T extends DocumentData>(collectionId: string, ...queryConstraints: QueryConstraint[]): FirekitCollectionGroup<T>;
export {};
