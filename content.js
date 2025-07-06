let maxDuration = 0;
let isFilterEnabled = false;

const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

browserAPI.storage.sync.get(['maxDuration', 'isEnabled'], function(result) {
  maxDuration = (result && result.maxDuration) || 0;
  isFilterEnabled = (result && result.isEnabled) || false;
  filterVideos();
});

browserAPI.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'sync') {
    if (changes.maxDuration) {
      maxDuration = changes.maxDuration.newValue || 0;
    }
    if (changes.isEnabled) {
      isFilterEnabled = changes.isEnabled.newValue || false;
    }
    filterVideos();
  }
});

function parseDuration(durationText) {
  if (!durationText) return 0;
  
  const parts = durationText.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
}

function filterVideos() {
  if (!isFilterEnabled || maxDuration <= 0) {
    const hiddenVideos = document.querySelectorAll('.yt-duration-filter-hidden');
    hiddenVideos.forEach(video => {
      video.style.display = '';
      video.classList.remove('yt-duration-filter-hidden');
    });
    return;
  }

  const videoSelectors = [
    'ytd-rich-item-renderer',
    'ytd-video-renderer',
    'ytd-compact-video-renderer',
    'ytd-grid-video-renderer'
  ];

  videoSelectors.forEach(selector => {
    const videos = document.querySelectorAll(selector);
    
    videos.forEach(video => {
      const durationElement = video.querySelector('.ytd-thumbnail-overlay-time-status-renderer span, #time-status span');
      
      if (durationElement) {
        const durationText = durationElement.textContent.trim();
        const durationInSeconds = parseDuration(durationText);
        
        if (durationInSeconds > maxDuration) {
          video.style.display = 'none';
          video.classList.add('yt-duration-filter-hidden');
        } else {
          video.style.display = '';
          video.classList.remove('yt-duration-filter-hidden');
        }
      }
    });
  });
}

const observer = new MutationObserver(function(mutations) {
  let shouldFilter = false;
  
  mutations.forEach(function(mutation) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      for (let node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const hasVideoContent = node.querySelector('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer');
          if (hasVideoContent || node.matches('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer')) {
            shouldFilter = true;
            break;
          }
        }
      }
    }
  });
  
  if (shouldFilter) {
    setTimeout(filterVideos, 100);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

setTimeout(filterVideos, 1000);