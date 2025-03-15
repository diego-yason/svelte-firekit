/**
 * @module FirekitDownloadUrl
 */
/**
 * Manages Firebase Storage download URL fetching with reactive state
 * @class
 *
 * @example
 * ```typescript
 * // Get download URL for image
 * const imageUrl = firekitDownloadUrl('images/photo.jpg');
 *
 * // Access reactive state
 * if (imageUrl.loading) {
 *   console.log('Loading URL...');
 * } else if (imageUrl.url) {
 *   console.log('Download URL:', imageUrl.url);
 * }
 * ```
 */
declare class FirekitDownloadUrl {
    /** Current download URL */
    private _url;
    /** Loading state */
    private _loading;
    /** Error state */
    private _error;
    /** Storage reference */
    private storageRef;
    /**
     * Creates a download URL fetcher
     * @param {string} path Storage path to file
     *
     * @example
     * ```typescript
     * const url = new FirekitDownloadUrl('documents/file.pdf');
     * ```
     */
    constructor(path: string);
    /**
     * Initializes download URL fetching
     * @private
     * @param {string} path Storage path
     */
    private initializeDownload;
    /** Gets current download URL */
    get url(): string | null;
    /** Gets loading state */
    get loading(): boolean;
    /** Gets error state */
    get error(): Error | null;
    /**
     * Refreshes download URL
     * Useful when file content has changed
     *
     * @example
     * ```typescript
     * // Refresh URL after file update
     * await uploadNewVersion();
     * imageUrl.refresh();
     * ```
     */
    refresh(): void;
}
/**
 * Creates a download URL fetcher
 * @param {string} path Storage path to file
 * @returns {FirekitDownloadUrl} Download URL fetcher instance
 *
 * @example
 * ```typescript
 * const imageUrl = firekitDownloadUrl('images/profile.jpg');
 *
 * // Use in template
 * {#if imageUrl.loading}
 *   <p>Loading...</p>
 * {:else if imageUrl.url}
 *   <img src={imageUrl.url} alt="Profile" />
 * {/if}
 * ```
 */
export declare function firekitDownloadUrl(path: string): FirekitDownloadUrl;
export {};
