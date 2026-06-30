import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, persistentLocalCache, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Silence benign future update warnings and verbose logs from the SDK
try {
  setLogLevel('error');
} catch (e) {
  // Ignore fallback if unsupported
}

// Resilient Firestore initialization wrapping persistent local cache in a try-catch to support restricted sandbox/iframes
let tempDb;
try {
  tempDb = initializeFirestore(app, {
    localCache: persistentLocalCache({})
  }, firebaseConfig.firestoreDatabaseId);
  console.log("Firestore initialized successfully with persistent local cache.");
} catch (error) {
  console.warn("Could not initialize with persistent local cache (possible sandbox/iframe restriction), falling back to baseline getFirestore:", error);
  tempDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = tempDb;
export const auth = getAuth(app);
export const storage = getStorage(app);

// Test connection on boot according to skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection test: SUCCESS");
  } catch (error) {
    // Gracefully handle any connection/offline fail on boot without polluting console as fatal
    console.debug("Firestore test connection status: Offline or Transient (" + (error instanceof Error ? error.message : String(error)) + ")");
  }
}
testConnection();

// Structured Firestore error parser required by platform
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isPermissionError = 
    (error && typeof error === 'object' && 'code' in error && (error as any).code === 'permission-denied') ||
    (error instanceof Error && (
      error.message.toLowerCase().includes('permission') || 
      error.message.toLowerCase().includes('insufficient') ||
      error.message.toLowerCase().includes('denied')
    ));

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  if (isPermissionError) {
    console.error('Firestore Permission Error details: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  } else {
    // Just log as a warning or info but DO NOT throw, to prevent crashing the offline application
    console.warn('Firestore Connection/Transient warning (non-blocking offline fallback): ', JSON.stringify(errInfo));
  }
}
