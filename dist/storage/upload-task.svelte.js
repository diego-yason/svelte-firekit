/**
 * @module FirekitUploadTask
 */
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { browser } from "$app/environment";
import { firebaseService } from "../firebase.js";
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
class FirekitUploadTask {
    /** Upload progress percentage */
    _progress = $state(0);
    /** Error state */
    _error = $state(null);
    /** Current upload snapshot */
    _snapshot = $state(null);
    /** Download URL of uploaded file */
    _downloadURL = $state(null);
    /** Upload completion state */
    _completed = $state(false);
    /** Upload task reference */
    uploadTask = null;
    /** Storage reference */
    storageRef = null;
    /** Derived download URL */
    URLdownload = $derived(this._downloadURL);
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
    constructor(path, file) {
        if (browser) {
            this.initializeUpload(path, file);
        }
    }
    /**
     * Initializes file upload
     * @private
     * @param {string} path Storage path
     * @param {File} file File to upload
     */
    initializeUpload(path, file) {
        try {
            const storage = firebaseService.getStorageInstance();
            this.storageRef = ref(storage, path);
            this.uploadTask = uploadBytesResumable(this.storageRef, file);
            this.uploadTask.on("state_changed", (snapshot) => {
                this._snapshot = snapshot;
                this._progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, (error) => {
                this._error = error;
            }, async () => {
                if (this.storageRef) {
                    this._downloadURL = await getDownloadURL(this.storageRef);
                    this._completed = true;
                }
            });
        }
        catch (error) {
            this._error = error;
        }
    }
    /** Pauses upload */
    pause() {
        this.uploadTask?.pause();
    }
    /** Resumes upload */
    resume() {
        this.uploadTask?.resume();
    }
    /** Cancels upload */
    cancel() {
        this.uploadTask?.cancel();
    }
    /** Gets upload progress percentage */
    get progress() {
        return this._progress;
    }
    /** Gets error state */
    get error() {
        return this._error;
    }
    /** Gets current upload snapshot */
    get snapshot() {
        return this._snapshot;
    }
    /** Gets download URL */
    get downloadURL() {
        return this._downloadURL;
    }
    /** Gets completion state */
    get completed() {
        return this._completed;
    }
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
export function firekitUploadTask(path, file) {
    return new FirekitUploadTask(path, file);
}
