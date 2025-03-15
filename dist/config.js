import { PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_MEASUREMENT_ID } from '$env/static/public';
/**
 * @module FirebaseConfig
 */
/**
 * Required environment variables for Firebase configuration.
 * These must be defined in your .env file or environment.
 * @typedef {Object} FirebaseEnvVars
 * @property {string} PUBLIC_FIREBASE_API_KEY - Firebase API key
 * @property {string} PUBLIC_FIREBASE_AUTH_DOMAIN - Firebase auth domain
 * @property {string} PUBLIC_FIREBASE_PROJECT_ID - Firebase project ID
 * @property {string} PUBLIC_FIREBASE_STORAGE_BUCKET - Firebase storage bucket
 * @property {string} PUBLIC_FIREBASE_MESSAGING_SENDER_ID - Firebase messaging sender ID
 * @property {string} PUBLIC_FIREBASE_APP_ID - Firebase app ID
 * @property {string} PUBLIC_FIREBASE_MEASUREMENT_ID - Firebase measurement ID
 */
/**
 * Singleton class that manages Firebase configuration.
 * Implements the Singleton pattern to ensure only one Firebase config instance exists.
 *
 * @example
 * // Get Firebase configuration
 * const config = FirebaseConfig.getInstance().getConfig();
 *
 * // Initialize Firebase app
 * const app = initializeApp(config);
 *
 * @throws {Error} If any required Firebase configuration variables are missing
 */
class FirebaseConfig {
    static instance;
    config;
    /**
     * Private constructor to prevent direct instantiation.
     * Validates all required environment variables are present and creates config.
     *
     * @private
     * @throws {Error} If any required Firebase configuration variables are missing
     */
    constructor() {
        const missingVars = this.getMissingFirebaseConfigVars();
        if (missingVars.length > 0) {
            throw Error(`The following Firebase configuration variables are missing: ${missingVars.join(', ')}`);
        }
        this.config = {
            apiKey: PUBLIC_FIREBASE_API_KEY,
            authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: PUBLIC_FIREBASE_APP_ID,
            measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
        };
    }
    /**
     * Checks for missing required Firebase configuration variables.
     *
     * @private
     * @returns {string[]} Array of missing environment variable names
     */
    getMissingFirebaseConfigVars() {
        const requiredVars = {
            'PUBLIC_FIREBASE_API_KEY': PUBLIC_FIREBASE_API_KEY,
            'PUBLIC_FIREBASE_AUTH_DOMAIN': PUBLIC_FIREBASE_AUTH_DOMAIN,
            'PUBLIC_FIREBASE_PROJECT_ID': PUBLIC_FIREBASE_PROJECT_ID,
            'PUBLIC_FIREBASE_STORAGE_BUCKET': PUBLIC_FIREBASE_STORAGE_BUCKET,
            'PUBLIC_FIREBASE_MESSAGING_SENDER_ID': PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            'PUBLIC_FIREBASE_APP_ID': PUBLIC_FIREBASE_APP_ID,
            'PUBLIC_FIREBASE_MEASUREMENT_ID': PUBLIC_FIREBASE_MEASUREMENT_ID
        };
        return Object.entries(requiredVars)
            .filter(([_, value]) => !value)
            .map(([key]) => key);
    }
    /**
     * Gets the singleton instance of FirebaseConfig.
     * Creates a new instance if one doesn't exist.
     *
     * @returns {FirebaseConfig} The singleton FirebaseConfig instance
     * @throws {Error} If any required Firebase configuration variables are missing
     */
    static getInstance() {
        if (!FirebaseConfig.instance) {
            FirebaseConfig.instance = new FirebaseConfig();
        }
        return FirebaseConfig.instance;
    }
    /**
     * Gets the Firebase configuration options.
     *
     * @returns {FirebaseOptions} The Firebase configuration options
     */
    getConfig() {
        return this.config;
    }
}
/**
 * Pre-initialized Firebase configuration instance.
 * Use this to get Firebase configuration options directly.
 *
 * @example
 * import { firebaseConfig } from './firebase-config';
 * import { initializeApp } from 'firebase/app';
 *
 * const app = initializeApp(firebaseConfig);
 */
export const firebaseConfig = FirebaseConfig.getInstance().getConfig();
