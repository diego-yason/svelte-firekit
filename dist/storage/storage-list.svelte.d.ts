/**
 * @module FirekitStorageList
 */
import { type StorageReference } from "firebase/storage";
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
declare class FirekitStorageList {
    /** List of files in directory */
    private _items;
    /** List of subdirectories */
    private _prefixes;
    /** Loading state */
    private _loading;
    /** Error state */
    private _error;
    /** Storage reference */
    private storageRef;
    /**
     * Creates a storage directory lister
     * @param {string} path Storage directory path
     *
     * @example
     * ```typescript
     * const list = new FirekitStorageList('uploads/2024');
     * ```
     */
    constructor(path: string);
    /**
     * Initializes directory listing
     * @private
     * @param {string} path Storage directory path
     */
    private initializeList;
    /** Gets list of files */
    get items(): StorageReference[];
    /** Gets list of subdirectories */
    get prefixes(): StorageReference[];
    /** Gets loading state */
    get loading(): boolean;
    /** Gets error state */
    get error(): Error | null;
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
    refresh(): void;
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
export declare function firekitStorageList(path: string): FirekitStorageList;
export {};
