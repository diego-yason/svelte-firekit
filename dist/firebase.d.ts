import { type FirebaseApp } from 'firebase/app';
import { type Firestore } from 'firebase/firestore';
import { type Auth } from 'firebase/auth';
import { type Functions } from 'firebase/functions';
import { type Database } from 'firebase/database';
import { type FirebaseStorage } from 'firebase/storage';
/**
 * Singleton service class that manages Firebase service instances.
 * Handles initialization and access to Firebase app and its various services.
 *
 * @example
 * // Get Firestore instance
 * const db = firebaseService.getDbInstance();
 *
 * // Get Auth instance
 * const auth = firebaseService.getAuthInstance();
 */
declare class FirebaseService {
    private static instance;
    private firebaseApp;
    private db;
    private auth;
    private functions;
    private database;
    private storage;
    /** Flag to determine if code is running in browser environment */
    private readonly isBrowser;
    /** @private */
    private constructor();
    /**
     * Gets the singleton instance of FirebaseService.
     * Creates a new instance if one doesn't exist.
     *
     * @returns {FirebaseService} The singleton FirebaseService instance
     */
    static getInstance(): FirebaseService;
    /**
     * Initializes or retrieves the Firebase app instance.
     * Also initializes Firestore if running in browser environment.
     *
     * @returns {FirebaseApp} The Firebase app instance
     */
    getFirebaseApp(): FirebaseApp;
    /**
     * Initializes Firestore with persistent cache and multi-tab support.
     * Only runs in browser environment.
     *
     * @private
     */
    private initializeFirestoreInstance;
    /**
     * Gets the Firestore instance, initializing it if necessary.
     *
     * @returns {Firestore} The Firestore instance
     */
    getDbInstance(): Firestore;
    /**
     * Gets the Authentication instance, initializing it if necessary.
     *
     * @returns {Auth} The Authentication instance
     */
    getAuthInstance(): Auth;
    /**
     * Gets the Cloud Functions instance, initializing it if necessary.
     *
     * @returns {Functions} The Cloud Functions instance
     */
    getFunctionsInstance(): Functions;
    /**
     * Gets the Realtime Database instance, initializing it if necessary.
     *
     * @returns {Database} The Realtime Database instance
     */
    getDatabaseInstance(): Database;
    /**
     * Gets the Storage instance, initializing it if necessary.
     *
     * @returns {FirebaseStorage} The Storage instance
     */
    getStorageInstance(): FirebaseStorage;
}
/**
 * Pre-initialized Firebase service instance.
 * Use this to access Firebase services directly.
 *
 * @example
 * import { firebaseService } from './firebase-service';
 *
 * // Get Firestore
 * const db = firebaseService.getDbInstance();
 *
 * // Get Auth
 * const auth = firebaseService.getAuthInstance();
 */
export declare const firebaseService: FirebaseService;
export {};
