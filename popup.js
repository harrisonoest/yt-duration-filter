document.addEventListener('DOMContentLoaded', function() {
    const enableFilterCheckbox = document.getElementById('enableFilter');
    const minDurationInput = document.getElementById('minDuration');
    const maxDurationInput = document.getElementById('maxDuration');
    const minDurationDisplay = document.querySelector('.min-duration-display');
    const maxDurationDisplay = document.querySelector('.max-duration-display');
    const saveButton = document.getElementById('saveSettings');
    const statusMessage = document.getElementById('statusMessage');
    const presetButtons = document.querySelectorAll('.preset-btn');

    const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

    browserAPI.storage.sync.get(['minDuration', 'maxDuration', 'isEnabled'], function(result) {
        const minDuration = (result && result.minDuration) || 0;
        const maxDuration = (result && result.maxDuration) || 600;
        const isEnabled = (result && result.isEnabled) || false;
        
        const minDurationInMinutes = Math.floor(minDuration / 60);
        const maxDurationInMinutes = Math.floor(maxDuration / 60);
        
        minDurationInput.value = minDurationInMinutes;
        maxDurationInput.value = maxDurationInMinutes;
        enableFilterCheckbox.checked = isEnabled;
        updateDurationDisplay(minDurationInMinutes, maxDurationInMinutes);
    });

    function updateDurationDisplay(minMinutes, maxMinutes) {
        function formatTime(minutes) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            
            if (hours > 0) {
                return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:00`;
            } else {
                return `${minutes}:00`;
            }
        }
        
        if (minMinutes !== undefined) {
            minDurationDisplay.textContent = formatTime(minMinutes);
        }
        if (maxMinutes !== undefined) {
            maxDurationDisplay.textContent = formatTime(maxMinutes);
        }
    }

    minDurationInput.addEventListener('input', function() {
        const minutes = parseInt(this.value, 10) || 0;
        updateDurationDisplay(minutes, undefined);
    });

    maxDurationInput.addEventListener('input', function() {
        const minutes = parseInt(this.value, 10) || 1;
        updateDurationDisplay(undefined, minutes);
    });

    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const minMinutes = parseInt(this.dataset.min, 10);
            const maxMinutes = parseInt(this.dataset.max, 10);
            
            minDurationInput.value = minMinutes;
            maxDurationInput.value = maxMinutes;
            updateDurationDisplay(minMinutes, maxMinutes);
            
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    saveButton.addEventListener('click', function() {
        const minDuration = parseInt(minDurationInput.value, 10) || 0;
        const maxDuration = parseInt(maxDurationInput.value, 10) || 10;
        const isEnabled = enableFilterCheckbox.checked;
        
        if (minDuration >= maxDuration) {
            statusMessage.textContent = 'Min duration must be less than max duration';
            statusMessage.className = 'status-message error';
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 3000);
            return;
        }
        
        const minDurationInSeconds = minDuration * 60;
        const maxDurationInSeconds = maxDuration * 60;
        
        browserAPI.storage.sync.set({
            minDuration: minDurationInSeconds,
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
        const minDuration = parseInt(minDurationInput.value, 10) || 0;
        const maxDuration = parseInt(maxDurationInput.value, 10) || 10;
        const minDurationInSeconds = minDuration * 60;
        const maxDurationInSeconds = maxDuration * 60;
        
        browserAPI.storage.sync.set({
            minDuration: minDurationInSeconds,
            maxDuration: maxDurationInSeconds,
            isEnabled: this.checked
        });
    });
});