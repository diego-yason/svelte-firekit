/**
 * @module FirekitRealtimeDB
 */
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { firebaseService } from "../firebase.js";
import { browser } from "$app/environment";
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
class FirekitRealtimeDB {
    /** Current data */
    _data = $state(null);
    /** Loading state */
    _loading = $state(true);
    /** Error state */
    _error = $state(null);
    /** Database reference */
    dbRef = null;
    /** Subscription cleanup function */
    unsubscribe = null;
    /**
     * Creates a Realtime Database subscription
     * @param {string} path Database path
     * @param {T} [startWith] Initial data before fetch completes
     */
    constructor(path, startWith) {
        this._data = startWith ?? null;
        if (browser) {
            this.initializeRealtimeDB(path);
        }
    }
    /**
     * Initializes database subscription
     * @private
     * @param {string} path Database path
     */
    initializeRealtimeDB(path) {
        try {
            const database = firebaseService.getDatabaseInstance();
            this.dbRef = ref(database, path);
            this.unsubscribe = onValue(this.dbRef, (snapshot) => {
                this._data = snapshot.val();
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
    async push(data) {
        if (!this.dbRef)
            return null;
        const newRef = push(this.dbRef);
        await set(newRef, data);
        return newRef.key;
    }
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
    async set(data) {
        if (!this.dbRef)
            return;
        await set(this.dbRef, data);
    }
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
    async update(data) {
        if (!this.dbRef)
            return;
        await update(this.dbRef, data);
    }
    /**
     * Removes data at reference
     *
     * @example
     * ```typescript
     * await chatRef.remove();
     * ```
     */
    async remove() {
        if (!this.dbRef)
            return;
        await remove(this.dbRef);
    }
    /** Gets current data */
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
    /**
     * Gets database reference
     * @throws {Error} If reference is not available
     */
    get ref() {
        if (!this.dbRef) {
            throw new Error("Database reference is not available");
        }
        return this.dbRef;
    }
    /** Cleanup subscription */
    dispose() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
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
export function firekitRealtimeDB(path, startWith) {
    return new FirekitRealtimeDB(path, startWith);
}
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
export function firekitRealtimeList(path, startWith = []) {
    const startWithRecord = startWith.reduce((acc, item, index) => {
        acc[`key${index}`] = item;
        return acc;
    }, {});
    return new class extends FirekitRealtimeDB {
        _list = $derived(this.data
            ? Object.entries(this.data).map(([key, value]) => ({
                id: key,
                ...value,
            }))
            : []);
        get list() {
            return this._list;
        }
    }(path, startWithRecord);
}
