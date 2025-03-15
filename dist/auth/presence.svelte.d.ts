/**
 * Geolocation configuration options
 */
interface GeolocationConfig {
    /** Whether geolocation tracking is enabled */
    enabled: boolean;
    /** Type of geolocation service to use */
    type: 'browser' | 'ip' | 'custom';
    /** Custom function for retrieving geolocation */
    customGeolocationFn?: () => Promise<{
        latitude: number;
        longitude: number;
    }>;
    /** URL for IP-based geolocation service */
    ipServiceUrl?: string;
    /** Whether user consent is required for location tracking */
    requireConsent?: boolean;
}
/**
 * Presence service configuration options
 */
interface PresenceConfig {
    /** Geolocation settings */
    geolocation?: GeolocationConfig;
    /** Session timeout in milliseconds */
    sessionTTL?: number;
    /** Presence update interval in milliseconds */
    updateInterval?: number;
}
/**
 * Location data structure
 */
interface Location {
    latitude: number | null;
    longitude: number | null;
    lastUpdated: string | null;
}
/**
 * Session data structure
 */
interface SessionData {
    uid: string;
    userId: string;
    deviceId: string;
    status: 'online' | 'offline' | 'away';
    createdAt: string;
    lastSeen: string;
    location?: Location;
}
/**
 * Presence event structure
 */
type PresenceEvent = {
    type: 'status_change' | 'error' | 'init' | 'disconnect' | 'location_update';
    data?: any;
    error?: Error;
    timestamp: number;
};
type PresenceEventCallback = (event: PresenceEvent) => void;
/**
 * Manages real-time user presence tracking with optional geolocation support
 * @class
 * @example
 * ```typescript
 * // Initialize presence tracking
 * await presenceService.initialize(currentUser, {
 *   geolocation: { enabled: true, type: 'browser' },
 *   sessionTTL: 30 * 60 * 1000
 * });
 *
 * // Listen for presence events
 * presenceService.addEventListener((event) => {
 *   console.log(event.type, event.data);
 * });
 * ```
 */
declare class PresenceService {
    private static instance;
    private connectedListener;
    private locationWatcher;
    private currentUser;
    private eventListeners;
    private config;
    private initialized;
    private locationConsent;
    private _currentSession;
    private _sessions;
    private _status;
    private _loading;
    private _error;
    private constructor();
    static getInstance(): PresenceService;
    /** Get current session data */
    get currentSession(): SessionData | null;
    /** Get all active sessions */
    get sessions(): SessionData[];
    /** Get current presence status */
    get status(): "online" | "offline" | "away";
    /** Get loading state */
    get loading(): boolean;
    /** Get error state */
    get error(): Error | null;
    /** Check if service is initialized */
    get isInitialized(): boolean;
    /** Check if location consent is granted */
    get hasLocationConsent(): boolean;
    /**
 * Initialize presence tracking
 * @param {any} user Current user object
 * @param {PresenceConfig} config Optional configuration
 * @throws {Error} If initialization fails
 */
    private initializePresence;
    private setupVisibilityListener;
    private getDeviceInfo;
    /**
    * Request location tracking consent
    * @returns {Promise<boolean>} Whether consent was granted
    */
    requestLocationConsent(): Promise<boolean>;
    private getLocation;
    initialize(user: any, config?: PresenceConfig): Promise<void>;
    private setPresence;
    private startLocationWatcher;
    private stopLocationWatcher;
    /**
      * Add presence event listener
      * @param {Function} callback Event callback function
      * @returns {Function} Cleanup function to remove listener
      */
    addEventListener(callback: PresenceEventCallback): () => boolean;
    private emitEvent;
    /**
         * Cleanup presence tracking
         */
    dispose(): void;
}
export declare const presenceService: PresenceService;
export {};
