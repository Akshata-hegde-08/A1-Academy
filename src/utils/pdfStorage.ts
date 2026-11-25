export interface StoredPdfRecord {
  id: string;
  fileName: string;
  size: number;
  updatedAt: number;
  blob: Blob;
}

const DB_NAME = 'a1-academy-lab-pdfs';
const DB_VERSION = 1;
const STORE_NAME = 'pdfs';

// In-memory fallback when IndexedDB is unavailable in restricted browser contexts
const memoryFallback = new Map<string, StoredPdfRecord>();

function openPdfDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error('Failed to open PDF store'));
  });
}

export async function getAllStoredPdfsForKeys(
  ids: string[],
): Promise<Record<string, StoredPdfRecord>> {
  const result: Record<string, StoredPdfRecord> = {};

  try {
    const db = await openPdfDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);

      let pending = ids.length;
      if (pending === 0) {
        resolve();
        return;
      }

      for (const id of ids) {
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result) {
            result[id] = req.result as StoredPdfRecord;
          }
          pending -= 1;
          if (pending === 0) resolve();
        };
        req.onerror = () => {
          pending -= 1;
          if (pending === 0) resolve();
        };
      }

      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    for (const id of ids) {
      const cached = memoryFallback.get(id);
      if (cached) result[id] = cached;
    }
  }

  return result;
}

export async function saveStoredPdf(
  id: string,
  file: File,
): Promise<StoredPdfRecord> {
  const record: StoredPdfRecord = {
    id,
    fileName: file.name,
    size: file.size,
    updatedAt: Date.now(),
    blob: file,
  };

  memoryFallback.set(id, record);

  try {
    const db = await openPdfDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Kept in memoryFallback cleanly
  }

  return record;
}

export async function deleteStoredPdf(id: string): Promise<void> {
  memoryFallback.delete(id);

  try {
    const db = await openPdfDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Removed from memoryFallback cleanly
  }
}
