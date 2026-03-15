# sCloud CDN SDK for FiveM

Official FiveM SDK for [sCloud CDN](https://sacul.cloud/solutions/cdn). This resource provides a high-performance, synchronous-feeling Lua API to interact with sCloud's CDN services.

## 🚀 Key Features

*   **Synchronous Lua API**: No callback hell. Use `Citizen.Await` patterns built-in for a native experience.
*   **Encrypted-Like Security**: Credentials stay in the server's environment/memory. No files to dump.
*   **Pure Convar Config**: Manage all your buckets and keys via a single server convar.
*   **Automatic Naming**: Intelligent randomization of filenames unless explicitly specified.

---

## 📦 Installation

1.  Download the latest release and place it in your `resources` folder.
2.  Ensure you have [`screenshot-basic`](https://github.com/citizenfx/screenshot-basic) installed.
3.  Configure your buckets in your `server.cfg`.

### Configuration (`server.cfg`)
To prevent credential leaks via resource dumps, all API keys must be set via the `SCLOUD_BUCKETS` convar on the server.

```cfg
# Format: set SCLOUD_BUCKETS "bucket_name:api_key,another_bucket:api_key"
set SCLOUD_BUCKETS "avatars:scloud_6b3e0ea...,mugs:scloud_4235028..."

ensure screenshot-basic # Always ensure this is started before scloud-sdk
ensure scloud-sdk
```

---

## 🛠️ API Reference

### Client-Side Exports

#### `takeScreenshot(options)`
Captures a screenshot of the client and uploads it.

*   **`options` (table)**:
    *   `bucket` (string, **required**): Bucket name.
    *   `path` (string, optional): Remote directory path (e.g., `"avatars/"`).
    *   `name` (string, optional): Custom filename.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

---

### Server-Side Exports (Synchronous)

#### `takeServerScreenshot(playerSource, options)`
Triggers a client screenshot remotely and uploads it.

*   **`playerSource` (number)**: Target player ID.
*   **`options` (table)**:
    *   `bucket` (string, **required**): Bucket name.
    *   `path` (string, optional): Remote directory path.
    *   `name` (string, optional): Custom filename.
    *   `timeout` (number, optional): Request timeout in ms (default: `10000`).
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

#### `requestPresignedUrl(options)`
Generates a temporary, secure upload URL.

*   **`options` (table)**:
    *   `bucket` (string, **required**): Bucket name.
    *   `path` (string, optional): Remote file path.
*   **Returns**: `string` (the URL) on success, or `nil` on failure.

#### `uploadImage(buffer, options)`
Uploads a binary buffer directly from the server.

*   **`options` (table)**:
    *   `bucket` (string, **required**): Bucket name.
    *   `path` (string, optional): Remote directory path.
    *   `name` (string, optional): Custom filename.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

---

## 💡 Examples

### Taking a Screenshot (Client)
```lua
local upload = exports["scloud-sdk"]:takeScreenshot({
    bucket = "avatars",
    path = "users/"
})

if upload then
    print("Uploaded to: " .. upload.url)
end
```

### Requesting Presigned URL (Server)
```lua
local request = exports["scloud-sdk"]:requestPresignedUrl({
    bucket = "mugs",
    path = "temporary/upload.png"
})

if request then
    print("Presigned URL: " .. request.url)
end
```

### Server-Side Screenshot (Admin)
```lua
local upload = exports["scloud-sdk"]:takeServerScreenshot(targetId, {
    bucket = "mugs",
    path = "evidence/"
})

if upload then
    print("Uploaded to: " .. upload.url)
end
```

---

## ⚖️ License
This project is licensed under the MIT License.
