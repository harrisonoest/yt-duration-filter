# YouTube Duration Filter

A browser extension that allows users to filter videos on YouTube's homepage by their duration. Users can set minimum and maximum duration ranges and the extension will hide videos that fall outside these limits.

## Features

- Filter YouTube videos by minimum and maximum duration ranges
- Easy-to-use popup interface with dual duration controls
- Custom preset management - create, edit, and delete your own duration presets
- Default preset options (0-5 min, 0-10 min, 5-20 min, 10-30 min)
- Toggle filter on/off
- Real-time filtering as you browse
- Persists settings and custom presets across browser sessions
- Cross-browser compatibility (Chrome, Firefox, Edge)

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

### Basic Filtering

1. Navigate to YouTube's homepage
2. Click the extension icon in your browser toolbar
3. Toggle "Enable Filter" to activate the extension
4. Set your desired duration range:
   - **Minimum Duration**: Videos shorter than this will be hidden
   - **Maximum Duration**: Videos longer than this will be hidden
   - Use the number input fields (in minutes) or preset buttons
5. Click "Save Settings" (popup will close automatically)
6. Videos outside your specified duration range will be hidden from the homepage

### Custom Presets

1. Click "Manage Presets" to open the preset management interface
2. **Add New Preset**:
   - Enter a preset name (e.g., "Short clips", "Tutorials")
   - Set minimum and maximum duration values
   - Click "Add Preset"
3. **Use Custom Presets**: Click any preset button to apply that duration range
4. **Delete Presets**: Click the × button next to any custom preset to remove it
5. **Reset to Default**: Click "Reset to Default" to restore the original 4 presets
6. Click "Done" to close the preset manager

### Examples

- **Short clips only**: Min: 0, Max: 5 (hides videos longer than 5 minutes)
- **Skip very short videos**: Min: 2, Max: 60 (hides videos under 2 minutes or over 1 hour)
- **Medium-length content**: Min: 10, Max: 30 (only shows videos between 10-30 minutes)

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
3. Videos falling outside the specified min/max duration range are hidden using CSS
4. Settings and custom presets are stored using the browser's storage API
5. The extension responds to dynamic content loading using MutationObserver
6. Cross-browser compatibility is achieved through API detection (Chrome vs Firefox)

### Storage

The extension stores the following data locally in your browser:
- `minDuration` - Minimum duration filter (in seconds)
- `maxDuration` - Maximum duration filter (in seconds) 
- `isEnabled` - Whether filtering is active
- `customPresets` - Array of user-defined preset configurations

### Permissions

- `storage` - To save user preferences and custom presets
- `activeTab` - To access the current YouTube tab
- `host_permissions` - To run on YouTube.com

### Firefox-Specific Notes

- Uses Manifest V2 for Firefox compatibility
- Requires explicit addon ID for storage API functionality
- Uses `browser` API instead of `chrome` API

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