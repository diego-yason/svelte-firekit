/**
 * @module FirekitUploadTask
 */
import { type UploadTaskSnapshot } from "firebase/storage";
/**
 * Manages Firebase Storage upload operations with reactive state and progress tracking
 * @class
 *
 * @example
 * ```typescript
 * // Create upload task
 * const upload = firekitUploadTask('images/photo.jpg', file);
 *
 * // Monitor progress
 * console.log(`Upload progress: ${upload.progress}%`);
 *
 * // Control upload
 * upload.pause();
 * upload.resume();
 * upload.cancel();
 * ```
 */
declare class FirekitUploadTask {
    /** Upload progress percentage */
    private _progress;
    /** Error state */
    private _error;
    /** Current upload snapshot */
    private _snapshot;
    /** Download URL of uploaded file */
    private _downloadURL;
    /** Upload completion state */
    private _completed;
    /** Upload task reference */
    private uploadTask;
    /** Storage reference */
    private storageRef;
    /** Derived download URL */
    readonly URLdownload: string | null;
    /**
     * Creates an upload task
     * @param {string} path Storage path for upload
     * @param {File} file File to upload
     *
     * @example
     * ```typescript
     * const task = new FirekitUploadTask('documents/report.pdf', file);
     * ```
     */
    constructor(path: string, file: File);
    /**
     * Initializes file upload
     * @private
     * @param {string} path Storage path
     * @param {File} file File to upload
     */
    private initializeUpload;
    /** Pauses upload */
    pause(): void;
    /** Resumes upload */
    resume(): void;
    /** Cancels upload */
    cancel(): void;
    /** Gets upload progress percentage */
    get progress(): number;
    /** Gets error state */
    get error(): Error | null;
    /** Gets current upload snapshot */
    get snapshot(): UploadTaskSnapshot | null;
    /** Gets download URL */
    get downloadURL(): string | null;
    /** Gets completion state */
    get completed(): boolean;
}
/**
 * Creates an upload task
 * @param {string} path Storage path for upload
 * @param {File} file File to upload
 * @returns {FirekitUploadTask} Upload task instance
 *
 * @example
 * ```typescript
 * const uploadTask = firekitUploadTask('images/profile.jpg', imageFile);
 *
 * // Template usage
 * {#if !uploadTask.completed}
 *   <progress value={uploadTask.progress} max="100" />
 * {:else}
 *   <img src={uploadTask.downloadURL} alt="Uploaded file" />
 * {/if}
 * ```
 */
export declare function firekitUploadTask(path: string, file: File): FirekitUploadTask;
export {};
