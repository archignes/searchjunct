// textareaHandler.js

// This function updates the hidden input based on the textarea's content
function updateHiddenInput(element) {
    const value = element.value;
    document.getElementById('search-bar').value = value; // Updates hidden input with textarea content
    element.parentNode.dataset.replicatedValue = value;
}

export function initializeTextarea() {
    const textarea = document.getElementById('autoresizing-textarea');
    textarea.oninput = function () {
        updateHiddenInput(this);
    };
    textarea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                // If 'Shift+Enter' is pressed, let the textarea create a new line as usual.
                // You don't have to do anything here, just prevent the form submission.
            } else {
                // If only 'Enter' is pressed, prevent the default action (new line) 
                // and instead perform your form submission logic.
                event.preventDefault();
                
                const allButtons = document.querySelectorAll('#search-systems-container button');
                if (currentSystemIndex < allButtons.length) {
                    allButtons[currentSystemIndex].click();
                }
            }
        }
    });

    // Handling auto-resizing of text areas
    document.querySelectorAll('textarea').forEach(el => {
        el.addEventListener('input', function () {
            updateHiddenInput(this);
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });

        el.dispatchEvent(new Event('input', {
            bubbles: true,
            cancelable: true
        }));
    });
}
