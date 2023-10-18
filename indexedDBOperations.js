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

export function deleteLog(logKey) {
    console.log(logKey)

    let transaction = db.transaction(["search_logs"], "readwrite");
    let request = transaction.objectStore("search_logs").delete(logKey);

    // report that the data item has been deleted
    transaction.oncomplete = () => {
        // delete the parent of the button, which is the list item, so it no longer is displayed
        // event.target.parentNode.parentNode.removeChild(event.target.parentNode);
        console.log("Log entry was successfully deleted.");
    };
    // Additional error handling can be added here
}

window.deleteLog = deleteLog;



export function displayHistory() {
    let historyContainer = document.getElementById('search-history-container');
    let objectStore = db.transaction("search_logs").objectStore("search_logs");

    objectStore.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
            let logElement = document.createElement('div');
            logElement.classList.add('log-entry');
            const logKey = cursor.key;
            console.log("Key for entry: ", cursor.key);  // 'cursor.key' contains the key for the current entry
            console.log("Value for entry: ", cursor.value); // 'cursor.value' contains the actual data for the current entry
            const log = cursor.value
            logElement.innerHTML = `
                <button class="delete-history" title="Delete History" onclick="deleteLog(${logKey})"><i class="bi bi-trash"></i></button>
                <span>${log.timestamp} - ${log.searchQuery}</span>`;
            historyContainer.appendChild(logElement);
            // continue to the next entry
            cursor.continue();
        } else {
            console.log('Entries all displayed.');
        }
    };

    historyContainer.classList.add('visible');
    historyContainer.classList.add('border');
    historyContainer.classList.add('rounded');
    let closeHistory = document.getElementById('close-history');
    closeHistory.classList.add('visible');
    let downloadHistory = document.getElementById('download-history');
    downloadHistory.classList.add('visible');



}

document.getElementById('history-button').addEventListener('click', displayHistory);

document.getElementById('close-history').addEventListener('click', () => {
    document.getElementById('search-history-container').classList.remove('visible');
});

// ... (Other functions like displayData, deleteLog, downloadLogs)

