# YouTube Duration Filter

A browser extension that allows users to filter videos on YouTube's homepage by their duration. Users can set a maximum duration and the extension will hide videos that exceed this limit.

## Features

- Filter YouTube videos by maximum duration
- Easy-to-use popup interface
- Preset duration options (5, 10, 20, 30 minutes)
- Toggle filter on/off
- Real-time filtering as you browse
- Persists settings across browser sessions

## Installation

### Chrome/Edge (Chromium-based browsers)

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension directory
5. The extension should now appear in your extensions list

### Firefox

1. Download or clone this repository
2. Rename `manifest-firefox.json` to `manifest.json` (backup the original first)
3. Open Firefox and navigate to `about:debugging`
4. Click "This Firefox" in the sidebar
5. Click "Load Temporary Add-on"
6. Select the `manifest.json` file from the extension directory

## Usage

1. Navigate to YouTube's homepage
2. Click the extension icon in your browser toolbar
3. Toggle "Enable Filter" to activate the extension
4. Set your desired maximum duration using:
   - The number input field (in minutes)
   - Preset buttons (5, 10, 20, 30 minutes)
5. Click "Save Settings"
6. Videos longer than your specified duration will be hidden from the homepage

## Technical Details

### Files Structure

- `manifest.json` - Extension configuration and permissions
- `content.js` - Main script that detects and filters YouTube videos
- `content.css` - CSS for hiding filtered videos
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality and settings management
- `popup.css` - Popup styling
- `background.js` - Service worker for extension initialization
- `icons/` - Extension icons (16x16, 48x48, 128x128)

### How It Works

1. The content script monitors YouTube's homepage for video elements
2. It extracts duration information from video thumbnails
3. Videos exceeding the maximum duration are hidden using CSS
4. Settings are stored using Chrome's storage API
5. The extension responds to dynamic content loading using MutationObserver

### Permissions

- `storage` - To save user preferences
- `activeTab` - To access the current YouTube tab
- `host_permissions` - To run on YouTube.com

## Browser Compatibility

- Chrome 88+
- Edge 88+
- Firefox 89+
- Other Chromium-based browsers

## Development

To modify the extension:

1. Make changes to the relevant files
2. Reload the extension in your browser's extension management page
3. Refresh YouTube to see changes

## Privacy

This extension:
- Only runs on YouTube.com
- Stores preferences locally in your browser
- Does not collect or transmit any user data
- Does not modify YouTube's servers or send external requests

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).