/**
 * @module FirekitDocumentMutations
 */
import { type DocumentData, type WithFieldValue, type PartialWithFieldValue } from "firebase/firestore";
/**
 * Response structure for document mutations
 * @interface MutationResponse
 * @template T Document data type
 */
interface MutationResponse<T> {
    /** Operation success status */
    success: boolean;
    /** Document data */
    data?: T;
    /** Document ID */
    id?: string;
    /** Error details if operation failed */
    error?: {
        code: string;
        message: string;
    };
}
/**
 * Options for document mutations
 * @interface MutationOptions
 */
interface MutationOptions {
    /** Whether to include timestamp fields */
    timestamps?: boolean;
    /** Whether to merge data in set operations */
    merge?: boolean;
    /** Custom document ID for add operations */
    customId?: string;
}
/**
 * Manages Firestore document mutations with automatic timestamps and error handling
 * @class
 * @example
 * ```typescript
 * // Add a new document
 * const result = await firekitDocMutations.add('users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 *
 * // Update a document
 * await firekitDocMutations.update('users/123', {
 *   name: 'Jane Doe'
 * });
 *
 * // Delete a document
 * await firekitDocMutations.delete('users/123');
 * ```
 */
declare class FirekitDocumentMutations {
    /**
     * Generates timestamp data for document mutations
     * @private
     * @param {boolean} [isNew=true] Whether this is a new document
     * @returns {Record<string, any>} Timestamp data
     */
    private getTimestampData;
    /**
     * Handles and formats mutation errors
     * @private
     * @param {any} error Error object
     * @returns {MutationResponse<never>} Formatted error response
     */
    private handleError;
    /**
     * Adds a new document to a collection
     * @template T Document data type
     * @param {string} collectionPath Collection path
     * @param {WithFieldValue<T>} data Document data
     * @param {MutationOptions} [options] Mutation options
     * @returns {Promise<MutationResponse<T>>} Mutation response
     *
     * @example
     * ```typescript
     * const result = await firekitDocMutations.add('users', {
     *   name: 'John Doe',
     *   email: 'john@example.com'
     * }, { timestamps: true, customId: 'custom-id' });
     * ```
     */
    add<T extends DocumentData>(collectionPath: string, data: WithFieldValue<T>, options?: MutationOptions): Promise<MutationResponse<T>>;
    /**
     * Sets document data at specified path
     * @template T Document data type
     * @param {string} path Document path
     * @param {WithFieldValue<T>} data Document data
     * @param {MutationOptions} [options] Mutation options
     * @returns {Promise<MutationResponse<T>>} Mutation response
     *
     * @example
     * ```typescript
     * const result = await firekitDocMutations.set('users/123', {
     *   name: 'John Doe',
     *   email: 'john@example.com'
     * }, { merge: true });
     * ```
     */
    set<T extends DocumentData>(path: string, data: WithFieldValue<T>, options?: MutationOptions): Promise<MutationResponse<T>>;
    /**
     * Updates a document at specified path
     * @template T Document data type
     * @param {string} path Document path
     * @param {PartialWithFieldValue<T>} data Update data
     * @param {MutationOptions} [options] Mutation options
     * @returns {Promise<MutationResponse<Partial<T>>>} Mutation response
     *
     * @example
     * ```typescript
     * const result = await firekitDocMutations.update('users/123', {
     *   name: 'Jane Doe'
     * });
     * ```
     */
    update<T extends DocumentData>(path: string, data: PartialWithFieldValue<T>, options?: MutationOptions): Promise<MutationResponse<Partial<T>>>;
    /**
     * Deletes a document at specified path
     * @param {string} path Document path
     * @returns {Promise<MutationResponse<void>>} Mutation response
     *
     * @example
     * ```typescript
     * const result = await firekitDocMutations.delete('users/123');
     * ```
     */
    delete(path: string): Promise<MutationResponse<void>>;
    /**
     * Checks if a document exists at specified path
     * @param {string} path Document path
     * @returns {Promise<boolean>} Whether document exists
     *
     * @example
     * ```typescript
     * const exists = await firekitDocMutations.exists('users/123');
     * ```
     */
    exists(path: string): Promise<boolean>;
    /**
     * Gets a document at specified path
     * @template T Document data type
     * @param {string} path Document path
     * @returns {Promise<MutationResponse<T>>} Mutation response with document data
     *
     * @example
     * ```typescript
     * const result = await firekitDocMutations.getDoc<UserData>('users/123');
     * if (result.success) {
     *   console.log(result.data);
     * }
     * ```
     */
    getDoc<T extends DocumentData>(path: string): Promise<MutationResponse<T>>;
}
/**
 * Pre-initialized instance of FirekitDocumentMutations
 * @const
 * @type {FirekitDocumentMutations}
 */
export declare const firekitDocMutations: FirekitDocumentMutations;
export {};
