const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(function() {
    browserAPI.storage.sync.get(['minDuration', 'maxDuration', 'isEnabled', 'customPresets'], function(result) {
        const updates = {};
        
        if (!result || result.maxDuration === undefined) {
            updates.minDuration = 0;
            updates.maxDuration = 600;
            updates.isEnabled = false;
        }
        
        if (!result || !result.customPresets) {
            updates.customPresets = [
                { name: '0-5 min', min: 0, max: 5 },
                { name: '0-10 min', min: 0, max: 10 },
                { name: '5-20 min', min: 5, max: 20 },
                { name: '10-30 min', min: 10, max: 30 }
            ];
        }
        
        if (Object.keys(updates).length > 0) {
            browserAPI.storage.sync.set(updates);
        }
    });
});

if (browserAPI.action) {
    browserAPI.action.onClicked.addListener(function(tab) {
        if (tab.url.includes('youtube.com')) {
            browserAPI.action.openPopup();
        }
    });
} else if (browserAPI.browserAction) {
    browserAPI.browserAction.onClicked.addListener(function(tab) {
        if (tab.url.includes('youtube.com')) {
            browserAPI.browserAction.openPopup();
        }
    });
}