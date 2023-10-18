// indexedDBOperations.js
let db;

export function initDatabase() {
    let request = window.indexedDB.open("SearchLogs", 1);

    request.onerror = event => {
        console.log("Database failed to open");
    };

    request.onsuccess = event => {
        // console.log("Database opened successfully");
        db = request.result;
    };

    request.onupgradeneeded = event => {
        let db = event.target.result;
        db.createObjectStore("search_logs", { autoIncrement: true });
        console.log('Database setup complete');
    };
}

export async function logSearchEvent(timestamp, query, system, searchUrl) {
    let newItem = {
        timestamp: timestamp.toISOString(),  // Convert date to string in ISO format
        searchQuery: query,
        searchSystem: system.name,  // Assuming 'system' is an object with a 'name' field
        searchUrl: searchUrl
    };

    let transaction = db.transaction(["search_logs"], "readwrite");
    let objectStore = transaction.objectStore("search_logs");
    let request = objectStore.add(newItem);
    request.onsuccess = () => {
        console.log("New log added to database.");
    };
    // Additional error handling can be added here
}

// ... (Other functions like displayData, deleteLog, downloadLogs)
