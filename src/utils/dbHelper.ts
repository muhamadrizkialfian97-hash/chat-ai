// IndexedDB helper for resilient local storage of large video/image backgrounds
const DB_NAME = "PancaranLobbyAssetsDB";
const STORE_NAME = "assets";
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // 800ms safety timeout to prevent hanging in sandboxed or cross-origin iframes
    const timeout = setTimeout(() => {
      reject(new Error("IndexedDB connection timeout (sandboxed iframe constraint)"));
    }, 800);

    try {
      if (!window.indexedDB) {
        clearTimeout(timeout);
        reject(new Error("IndexedDB is not supported in this browser/context"));
        return;
      }
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      
      request.onsuccess = () => {
        clearTimeout(timeout);
        resolve(request.result);
      };
      
      request.onerror = () => {
        clearTimeout(timeout);
        reject(request.error || new Error("IndexedDB open error"));
      };
      
      request.onblocked = () => {
        clearTimeout(timeout);
        reject(new Error("IndexedDB open blocked"));
      };
    } catch (err) {
      clearTimeout(timeout);
      reject(err);
    }
  });
}

export async function saveAssetToLocalDB(key: string, blob: Blob): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to save asset to IndexedDB:", err);
  }
}

export async function getAssetFromLocalDB(key: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.error("Failed to retrieve asset from IndexedDB:", err);
    return null;
  }
}

export async function removeAssetFromLocalDB(key: string): Promise<void> {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to delete asset from IndexedDB:", err);
  }
}
