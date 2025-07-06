const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(function() {
    browserAPI.storage.sync.get(['maxDuration', 'isEnabled'], function(result) {
        if (!result || result.maxDuration === undefined) {
            browserAPI.storage.sync.set({
                maxDuration: 600,
                isEnabled: false
            });
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