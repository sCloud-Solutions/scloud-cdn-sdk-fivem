# sCloud CDN SDK for FiveM

Official FiveM SDK for [sCloud CDN](https://sacul.cloud/solutions/cdn). This resource provides a high-performance, synchronous-feeling Lua API to interact with sCloud's CDN services, including screenshot capture and file uploads.

## 🚀 Key Features

*   **Synchronous Lua API**: No callback hell. Use `Citizen.Await` patterns built-in for a native experience.
*   **Secure Uploads**: Support for direct uploads and presigned URLs.
*   **Flexible Configuration**: Global defaults via convars or per-request overrides.
*   **Automatic Naming**: Intelligent randomization of filenames unless explicitly specified.

---

## 📦 Installation

1.  Download the latest release and place it in your `resources` folder.
2.  Ensure you have [`screenshot-basic`](https://github.com/citizenfx/screenshot-basic) installed and running.
3.  Configure your credentials in your `server.cfg`:

```cfg
# Global Configuration
set SCLOUD_DEFAULT_BUCKET "your-bucket-name"
set SCLOUD_DEFAULT_API_KEY "your-api-key"

ensure screenshot-basic
ensure scloud-cdn-sdk-fivem
```

---

## 🛠️ API Reference

### Client-Side Exports

#### `takeScreenshot(options)`
Captures a screenshot of the client and uploads it to sCloud.

*   **`options` (table)**:
    *   `path` (string, optional): Remote directory path (e.g., `"avatars/"`).
    *   `name` (string, optional): Custom filename. If not provided, a random UUID is used.
    *   `bucket` (string, optional): Override the default bucket.
    *   `apiKey` (string, optional): Override the default API key.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

---

### Server-Side Exports

#### `takeServerScreenshot(playerSource, path, options, timeout)`
Remotely triggers a client screenshot and uploads it.

*   **`playerSource` (number)**: The source of the player.
*   **`path` (string)**: The remote path (used if `options.path` is empty).
*   **`options` (table, optional)**: Same as client-side `options`.
*   **`timeout` (number, optional)**: Request timeout in milliseconds (default: `10000`).
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

#### `requestPresignedUrl(path, options)`
Generates a temporary, secure upload URL.

*   **`path` (string)**: The remote path.
*   **`options` (table, optional)**: `{ bucket, apiKey }`.
*   **Returns**: `string` (the URL) on success, or `nil` on failure.

#### `uploadImage(buffer, path, options)`
Uploads a binary buffer directly from the server.

*   **`buffer` (bytes/string)**: The file data.
*   **`path` (string)**: The remote path.
*   **`options` (table, optional)**: Same as client-side `options`.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

---

## 💡 Examples

### Taking a Screenshot (Client)
```lua
local upload = exports["scloud-cdn-sdk-fivem"]:takeScreenshot({
    path = "user_screenshots/",
    name = "my_awesome_photo.png"
})

if upload then
    print("Image live at: " .. upload.url)
else
    print("Capture failed")
end
```

### Admin Capture (Server)
```lua
RegisterCommand("report_proof", function(source, args)
    local targetId = tonumber(args[1])
    local upload = exports["scloud-cdn-sdk-fivem"]:takeServerScreenshot(targetId, "admin_proofs/")
    
    if upload then
        print("Proof captured for admin review: " .. upload.url)
    end
end, true)
```

### Direct Buffer Upload (Server)
```lua
local myData = "..." -- Binary image data
local upload = exports["scloud-cdn-sdk-fivem"]:uploadImage(myData, "logs/icons/", {
    name = "status_icon.png"
})
```

---

## ⚖️ License
This project is licensed under the MIT License.
