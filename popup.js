document.addEventListener('DOMContentLoaded', function() {
    const enableFilterCheckbox = document.getElementById('enableFilter');
    const maxDurationInput = document.getElementById('maxDuration');
    const durationDisplay = document.querySelector('.duration-display');
    const saveButton = document.getElementById('saveSettings');
    const statusMessage = document.getElementById('statusMessage');
    const presetButtons = document.querySelectorAll('.preset-btn');

    const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

    browserAPI.storage.sync.get(['maxDuration', 'isEnabled'], function(result) {
        const maxDuration = (result && result.maxDuration) || 600;
        const isEnabled = (result && result.isEnabled) || false;
        
        const maxDurationInMinutes = Math.floor(maxDuration / 60);
        maxDurationInput.value = maxDurationInMinutes;
        enableFilterCheckbox.checked = isEnabled;
        updateDurationDisplay(maxDurationInMinutes);
    });

    function updateDurationDisplay(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours > 0) {
            durationDisplay.textContent = `${hours}:${remainingMinutes.toString().padStart(2, '0')}:00`;
        } else {
            durationDisplay.textContent = `${minutes}:00`;
        }
    }

    maxDurationInput.addEventListener('input', function() {
        const minutes = parseInt(this.value, 10) || 1;
        updateDurationDisplay(minutes);
    });

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minutes = parseInt(this.dataset.minutes, 10);
            maxDurationInput.value = minutes;
            updateDurationDisplay(minutes);
            
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    saveButton.addEventListener('click', function() {
        const maxDuration = parseInt(maxDurationInput.value, 10) || 10;
        const isEnabled = enableFilterCheckbox.checked;
        
        const maxDurationInSeconds = maxDuration * 60;
        
        browserAPI.storage.sync.set({
            maxDuration: maxDurationInSeconds,
            isEnabled: isEnabled
        }, function() {
            statusMessage.textContent = 'Settings saved!';
            statusMessage.className = 'status-message success';
            
            setTimeout(() => {
                window.close();
            }, 500);
        });
    });

    enableFilterCheckbox.addEventListener('change', function() {
        const maxDuration = parseInt(maxDurationInput.value, 10) || 10;
        const maxDurationInSeconds = maxDuration * 60;
        
        browserAPI.storage.sync.set({
            maxDuration: maxDurationInSeconds,
            isEnabled: this.checked
        });
    });
});