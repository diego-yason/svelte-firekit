/**
 * @module FirekitRealtimeDB
 */
import { type DatabaseReference } from "firebase/database";
/**
 * Manages real-time Firebase Realtime Database subscriptions with reactive state
 * @class
 * @template T Data type
 *
 * @example
 * ```typescript
 * interface ChatMessage {
 *   text: string;
 *   userId: string;
 *   timestamp: number;
 * }
 *
 * // Create regular reference
 * const chatRef = firekitRealtimeDB<ChatMessage>('chats/123');
 *
 * // Create list reference
 * const messagesList = firekitRealtimeList<ChatMessage>('messages');
 * ```
 */
declare class FirekitRealtimeDB<T> {
    /** Current data */
    private _data;
    /** Loading state */
    private _loading;
    /** Error state */
    private _error;
    /** Database reference */
    private dbRef;
    /** Subscription cleanup function */
    private unsubscribe;
    /**
     * Creates a Realtime Database subscription
     * @param {string} path Database path
     * @param {T} [startWith] Initial data before fetch completes
     */
    constructor(path: string, startWith?: T);
    /**
     * Initializes database subscription
     * @private
     * @param {string} path Database path
     */
    private initializeRealtimeDB;
    /**
     * Pushes new data to list
     * @param {T} data Data to push
     * @returns {Promise<string | null>} New item key or null if failed
     *
     * @example
     * ```typescript
     * const key = await chatRef.push({
     *   text: 'Hello',
     *   userId: '123',
     *   timestamp: Date.now()
     * });
     * ```
     */
    push(data: T): Promise<string | null>;
    /**
     * Sets data at reference
     * @param {T} data Data to set
     *
     * @example
     * ```typescript
     * await chatRef.set({
     *   text: 'Updated message',
     *   userId: '123',
     *   timestamp: Date.now()
     * });
     * ```
     */
    set(data: T): Promise<void>;
    /**
     * Updates data at reference
     * @param {Partial<T>} data Data to update
     *
     * @example
     * ```typescript
     * await chatRef.update({
     *   text: 'Edited message'
     * });
     * ```
     */
    update(data: Partial<T>): Promise<void>;
    /**
     * Removes data at reference
     *
     * @example
     * ```typescript
     * await chatRef.remove();
     * ```
     */
    remove(): Promise<void>;
    /** Gets current data */
    get data(): T | null;
    /** Gets loading state */
    get loading(): boolean;
    /** Gets error state */
    get error(): Error | null;
    /**
     * Gets database reference
     * @throws {Error} If reference is not available
     */
    get ref(): DatabaseReference;
    /** Cleanup subscription */
    dispose(): void;
}
/**
 * Creates a reactive Realtime Database reference
 * @template T Data type
 * @param {string} path Database path
 * @param {T} [startWith] Initial data
 * @returns {FirekitRealtimeDB<T>} Database subscription instance
 *
 * @example
 * ```typescript
 * const chatRef = firekitRealtimeDB<ChatMessage>('chats/123');
 * ```
 */
export declare function firekitRealtimeDB<T>(path: string, startWith?: T): FirekitRealtimeDB<T>;
/**
 * Creates a reactive Realtime Database list reference
 * Automatically converts data to array format with IDs
 *
 * @template T List item type
 * @param {string} path Database path
 * @param {T[]} [startWith=[]] Initial array data
 * @returns {FirekitRealtimeDB} Database subscription instance with array support
 *
 * @example
 * ```typescript
 * const messagesList = firekitRealtimeList<ChatMessage>('messages');
 * console.log(messagesList.list); // Array of messages with IDs
 * ```
 */
export declare function firekitRealtimeList<T>(path: string, startWith?: T[]): FirekitRealtimeDB<Record<string, T>> & {
    list: Array<T & {
        id: string;
    }>;
};
export {};
