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

When using this method, the client only needs to pass the bucket name (e.g., `"avatars"`), and the server will automatically resolve the correct key from memory. **Never pass API keys from the client.**

---

## 🛠️ API Reference

### Client-Side Exports

#### `takeScreenshot(options)`
Captures a screenshot of the client and uploads it.

*   **`options` (table)**:
    *   `bucket` (string, **required**): Bucket name (must match a name in `SCLOUD_BUCKETS`).
    *   `path` (string, optional): Remote directory path.
    *   `name` (string, optional): Custom filename.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

---

### Server-Side Exports

#### `requestPresignedUrl(path, options)`
Generates a temporary, secure upload URL.

*   **`path` (string)**: The remote path.
*   **`options` (table, optional)**: `{ bucket, apiKey }`.
*   **Returns**: `string` (the URL) on success, or `nil` on failure.

#### `takeServerScreenshot(playerSource, path, options, timeout)`
Triggers a client screenshot remotely.

*   **`playerSource` (number)**: Player ID.
*   **`path` (string)**: Remote path.
*   **`options` (table, optional)**: Same as client-side `options`.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

#### `uploadImage(buffer, path, options)`
Uploads a binary buffer directly from the server.

*   **`buffer` (bytes/string)**: The file data.
*   **`path` (string)**: The remote path.
*   **`options` (table, optional)**: Same as client-side `options`.
*   **Returns**: `table` containing `{ url = string }` on success, or `nil` on failure.

---

## ⚖️ License
This project is licensed under the MIT License.
