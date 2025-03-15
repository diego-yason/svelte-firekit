import { initializeApp, getApps } from 'firebase/app';
import { initializeFirestore, CACHE_SIZE_UNLIMITED, persistentLocalCache, persistentMultipleTabManager, enablePersistentCacheIndexAutoCreation, getPersistentCacheIndexManager, } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from './config.js';
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
class FirebaseService {
    static instance;
    firebaseApp = null;
    db = null;
    auth = null;
    functions = null;
    database = null;
    storage = null;
    /** Flag to determine if code is running in browser environment */
    isBrowser = typeof window !== 'undefined';
    /** @private */
    constructor() { }
    /**
     * Gets the singleton instance of FirebaseService.
     * Creates a new instance if one doesn't exist.
     *
     * @returns {FirebaseService} The singleton FirebaseService instance
     */
    static getInstance() {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }
    /**
     * Initializes or retrieves the Firebase app instance.
     * Also initializes Firestore if running in browser environment.
     *
     * @returns {FirebaseApp} The Firebase app instance
     */
    getFirebaseApp() {
        if (this.firebaseApp)
            return this.firebaseApp;
        const existingApps = getApps();
        if (existingApps.length) {
            this.firebaseApp = existingApps[0];
        }
        else {
            this.firebaseApp = initializeApp(firebaseConfig);
            console.log(`${firebaseConfig.projectId} initialized on ${this.isBrowser ? 'client' : 'server'}`);
        }
        this.initializeFirestoreInstance();
        return this.firebaseApp;
    }
    /**
     * Initializes Firestore with persistent cache and multi-tab support.
     * Only runs in browser environment.
     *
     * @private
     */
    initializeFirestoreInstance() {
        if (this.db || !this.isBrowser)
            return;
        this.db = initializeFirestore(this.firebaseApp, {
            localCache: persistentLocalCache({
                cacheSizeBytes: CACHE_SIZE_UNLIMITED,
                tabManager: persistentMultipleTabManager()
            }),
        });
        const indexManager = getPersistentCacheIndexManager(this.db);
        if (indexManager) {
            enablePersistentCacheIndexAutoCreation(indexManager);
            console.log('Firestore persistent cache indexing is enabled');
        }
        else {
            console.warn('Failed to initialize the Firestore cache index manager');
        }
    }
    /**
     * Gets the Firestore instance, initializing it if necessary.
     *
     * @returns {Firestore} The Firestore instance
     */
    getDbInstance() {
        if (!this.db)
            this.getFirebaseApp();
        return this.db;
    }
    /**
     * Gets the Authentication instance, initializing it if necessary.
     *
     * @returns {Auth} The Authentication instance
     */
    getAuthInstance() {
        if (!this.auth)
            this.auth = getAuth(this.getFirebaseApp());
        return this.auth;
    }
    /**
     * Gets the Cloud Functions instance, initializing it if necessary.
     *
     * @returns {Functions} The Cloud Functions instance
     */
    getFunctionsInstance() {
        if (!this.functions)
            this.functions = getFunctions(this.getFirebaseApp());
        return this.functions;
    }
    /**
     * Gets the Realtime Database instance, initializing it if necessary.
     *
     * @returns {Database} The Realtime Database instance
     */
    getDatabaseInstance() {
        if (!this.database)
            this.database = getDatabase(this.getFirebaseApp());
        return this.database;
    }
    /**
     * Gets the Storage instance, initializing it if necessary.
     *
     * @returns {FirebaseStorage} The Storage instance
     */
    getStorageInstance() {
        if (!this.storage)
            this.storage = getStorage(this.getFirebaseApp());
        return this.storage;
    }
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
export const firebaseService = FirebaseService.getInstance();
