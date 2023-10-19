// main.js
import { initDatabase, logSearchEvent, displayHistory } from './indexedDBOperations.js';
import { initializeTextarea, setTextareaFromParams } from './textareaHandler.js';

// Global variable to keep track of the current search system index
window.currentSystemIndex = 0;

// Function to reshuffle the array of systems
function reshuffleSystems(systemsArray) {
    if (!systemsArray) {
        console.error('No systems array provided to reshuffle.');
        return;
    }
    for (let i = systemsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [systemsArray[i], systemsArray[j]] = [systemsArray[j], systemsArray[i]]; // Swap
    }
    updateSystemIndex();
    updateStatusLabels();
}

function handleSearch(system) {
    const searchBar = document.getElementById('search-bar');
    const autoresizingTextarea = document.getElementById('autoresizing-textarea');

    if (!searchBar || !autoresizingTextarea) {
        console.error('Required elements not found in the DOM');
        return false;
    }
    const query = searchBar.value;
    if (!query) {
        autoresizingTextarea.classList.add('flash-error');
        setTimeout(() => autoresizingTextarea.classList.remove('flash-error'), 500);
        return false;
    }

    const searchUrl = system.url + encodeURIComponent(query);
    const timestamp = new Date();
    logSearchEvent(timestamp, query, system, searchUrl);
    window.open(searchUrl, '_blank');
}

// Function to update the visual state of buttons
function updateButtonStyles() {
    const allButtons = document.querySelectorAll('#search-systems-container button');

    allButtons.forEach((button) => {
        if (button.dataset.searched === 'true') {
            button.className = 'btn btn-dark btn-block'; // Already clicked systems, dark grey
        } else if (Array.from(allButtons).indexOf(button) === currentSystemIndex) {
            button.className = 'btn btn-secondary btn-block'; // Current system, secondary color
        } else {
            button.className = 'btn btn-light btn-block'; // Rest of the systems, light grey
        }
    });
    allButtons.forEach((button) => {
        const label = button.nextSibling;
 
    });
}

function updateSystemIndex() {
    const buttons = document.querySelectorAll('#search-systems-container button');
    // Iterate through the buttons
    for (let index = 0; index < buttons.length; index++) {
        // Check the 'data-searched' attribute of the button
        if (buttons[index].getAttribute('data-searched') !== 'true') {
            // If the button hasn't been searched, return its index
            currentSystemIndex = index;
            return
        }
    }
    // If all buttons have been searched, return null
    return null;
}




function populateSearchSystems(systems, refreshButtons = false) {
    const container = document.getElementById('search-systems-container');
    container.className = 'col-10 mx-auto'
    let oldButtons = [];
    if (!refreshButtons) {
        oldButtons = Array.from(container.children);
    }
    container.innerHTML = ''; // Clear existing content

    systems.forEach((system, index) => {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container d-flex align-items-center my-1';

        // Create the button
        const button = document.createElement('button');
        button.type = 'button';
        button.id = system.name
        button.textContent = system.name; // Set button text to the system's name
        button.className = 'btn btn-light flex-grow-1'; // Make the button grow to take available space

        // Create the label
        const statusLabel = document.createElement('span');
        statusLabel.className = 'status-label small ml-2'; // Use margin for a bit of spacing

        // Append button and label to the container
        buttonContainer.appendChild(button);
        buttonContainer.appendChild(statusLabel); // This will be placed next to the button due to the 'flex' display

        // Set the click event for each button
        button.addEventListener('click', () => {
            const searchOpened = handleSearch(system);   // Handle the search action
            if (searchOpened !== false) {
                button.dataset.searched = 'true'; // Add a data attribute to the button
                const timestamp = new Date();
                button.dataset.search_timestamp = timestamp.toISOString();
                
                updateSystemIndex();
                updateButtonStyles();       // Update styles after search
                updateStatusLabels();       // Update labels after search
            }
        });

        // If the button was previously created and refreshButtons is false, maintain its dataset and label
        if (!refreshButtons) {
            oldButtons.forEach(oldButton => {
                const oldButtonElement = oldButton.querySelector('button');        
                if (oldButtonElement && oldButtonElement.id === button.id) {
                    button.dataset.searched = oldButtonElement.dataset.searched;
                    button.dataset.search_timestamp = oldButtonElement.dataset.search_timestamp;
                    statusLabel.textContent = oldButtonElement.nextSibling.textContent;
                }
            });
        }
        container.appendChild(buttonContainer); // Append the button to the container
    });

    // After populating, update the labels for the first time
    updateStatusLabels();
}

// Function to toggle the visibility of all status labels
function toggleStatusLabels() {
    const allStatusLabels = document.querySelectorAll('.status-label');
    allStatusLabels.forEach((label) => {
        if (label.classList.contains('visible')) {
            label.classList.remove('visible');
        } else {
            label.classList.add('visible');
        }
    });
}

// Function to update the labels on the buttons based on their state
function updateStatusLabels() {
    const allButtonContainers = document.querySelectorAll('.button-container');

    allButtonContainers.forEach((container, index) => {
        const statusLabel = container.querySelector('.status-label');
        const button = container.querySelector('button');
        if (statusLabel && button) {
            if (button.dataset.searched === 'true') {
                const timestamp = new Date(button.dataset.search_timestamp);
                statusLabel.textContent = "Searched " + timestamp.toLocaleString();
            } else if (index === currentSystemIndex) {
                statusLabel.textContent = 'Next to be searched...';
            } else {
                statusLabel.textContent = 'To be searched...';
            }
        }
    });
}

// Function to reset and repopulate the search systems
function resetSearchSystems() {
    reshuffleSystems(searchSystems); // Reshuffle the array
    const refreshButtons = true
    populateSearchSystems(searchSystems, refreshButtons); // Repopulate the buttons
    currentSystemIndex = 0
    updateButtonStyles(); // Update buttons' visual states
    updateStatusLabels();
}

export function clearSearch() {
    const allButtons = document.querySelectorAll('#search-systems-container button');
    const anySearchesDone = Array.from(allButtons).some(button => button.dataset.searched === 'true');
    if (anySearchesDone) {
        resetSearchSystems();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var textarea = document.getElementById('autoresizing-textarea');
    textarea.focus();

    // This function updates the page title
    function updateTitle() {
        var newText = textarea.value;
        if (newText.trim()) { // checks if there's any non-space character
            document.title = `[${newText}]`;
        } else {
            document.title = 'SearchJunct'; // revert to original if textarea is empty
        }
    }

    // Event listener for input on the textarea
    textarea.addEventListener('input', updateTitle);

    // Additional feature: if you want to capture when someone pastes text as well
    textarea.addEventListener('paste', function (event) {
        // This ensures the pasted content is picked up in the 'input' event
        setTimeout(updateTitle, 0);
    });

});

// This function will run once the HTML is loaded
window.onload = function () {
    initDatabase();
    initializeTextarea(); // initialize the textarea logic

    // Event listener for the reshuffle button
    document.getElementById('reshuffle-button').addEventListener('click', function () {
        reshuffleSystems(searchSystems);
        populateSearchSystems(searchSystems); // Repopulate the buttons
        updateSystemIndex();
        updateButtonStyles();
        updateStatusLabels();
        const stateButton = document.getElementById('state-button');
        if (stateButton.classList.contains('showing_state')) {
            toggleStatusLabels();
        }
    });

    document.getElementById('state-button').addEventListener('click', function () {
        this.classList.toggle('showing_state');
        toggleStatusLabels();
    });

    document.getElementById('shortcut-help-button').addEventListener('click', function () {
        this.classList.toggle('showing_state'); 
        const shortcutHelpPopup = document.getElementById('shortcut-help-popup');
        shortcutHelpPopup.classList.toggle('visible');
    });

    document.getElementById('history-button').addEventListener('click', function () {
        this.classList.toggle('showing_state');
        const historyContainer = document.getElementById('history-container');
        if (this.classList.contains('showing_state')) {
            displayHistory();
        } else {
            document.getElementById('history-container').classList.remove('visible');
        }
    });

    document.getElementById('magnifying-glass').addEventListener('click', function () {
        const allButtons = document.querySelectorAll('#search-systems-container button');
        if (currentSystemIndex < allButtons.length) {
            allButtons[currentSystemIndex].click();
        }
    });

    document.getElementById('autoresizing-textarea').addEventListener('input', function () {
        if (this.value === '') {
            clearSearch();
        }
    });


    // Call functions to set the initial state
    resetSearchSystems();
    setTextareaFromParams()
};

