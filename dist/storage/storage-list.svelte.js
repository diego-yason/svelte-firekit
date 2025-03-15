/**
 * @module FirekitStorageList
 */
import { ref, listAll } from "firebase/storage";
import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";
/**
 * Manages Firebase Storage directory listing with reactive state
 * @class
 *
 * @example
 * ```typescript
 * // List contents of images directory
 * const imagesList = firekitStorageList('images');
 *
 * // Access items and folders
 * console.log('Files:', imagesList.items);
 * console.log('Folders:', imagesList.prefixes);
 * ```
 */
class FirekitStorageList {
    /** List of files in directory */
    _items = $state([]);
    /** List of subdirectories */
    _prefixes = $state([]);
    /** Loading state */
    _loading = $state(true);
    /** Error state */
    _error = $state(null);
    /** Storage reference */
    storageRef = null;
    /**
     * Creates a storage directory lister
     * @param {string} path Storage directory path
     *
     * @example
     * ```typescript
     * const list = new FirekitStorageList('uploads/2024');
     * ```
     */
    constructor(path) {
        if (browser) {
            this.initializeList(path);
        }
    }
    /**
     * Initializes directory listing
     * @private
     * @param {string} path Storage directory path
     */
    async initializeList(path) {
        try {
            const storage = firebaseService.getStorageInstance();
            this.storageRef = ref(storage, path);
            const result = await listAll(this.storageRef);
            this._items = result.items;
            this._prefixes = result.prefixes;
            this._loading = false;
        }
        catch (error) {
            this._error = error;
            this._loading = false;
        }
    }
    /** Gets list of files */
    get items() {
        return this._items;
    }
    /** Gets list of subdirectories */
    get prefixes() {
        return this._prefixes;
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
     * Refreshes directory listing
     * Useful when directory contents have changed
     *
     * @example
     * ```typescript
     * // Refresh after upload
     * await uploadFile('images/new.jpg');
     * imagesList.refresh();
     * ```
     */
    refresh() {
        if (this.storageRef) {
            this._loading = true;
            this._error = null;
            this.initializeList(this.storageRef.fullPath);
        }
    }
}
/**
 * Creates a storage directory lister
 * @param {string} path Storage directory path
 * @returns {FirekitStorageList} Storage list instance
 *
 * @example
 * ```typescript
 * const documents = firekitStorageList('documents');
 *
 * // Use in template
 * {#if documents.loading}
 *   <p>Loading...</p>
 * {:else}
 *   <ul>
 *     {#each documents.items as item}
 *       <li>{item.name}</li>
 *     {/each}
 *   </ul>
 * {/if}
 * ```
 */
export function firekitStorageList(path) {
    return new FirekitStorageList(path);
}
