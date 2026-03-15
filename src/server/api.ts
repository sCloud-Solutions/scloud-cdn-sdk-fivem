import * as v from 'valibot';
import fetch from 'cross-fetch';
import FormData from 'form-data';

const CDN_BASE_URL = 'https://cdn.sacul.cloud';

export interface SCloudConfig {
    bucket?: string;
    apiKey?: string;
    name?: string;
}

function getKeysFromConvar(): Map<string, string> {
    const registry = new Map<string, string>();
    const rawValue = GetConvar('SCLOUD_BUCKETS', '');

    if (!rawValue || rawValue === '') return registry;

    const pairs = rawValue.split(',');
    for (const pair of pairs) {
        const [name, key] = pair.split(':');
        if (name && key) {
            registry.set(name.trim(), key.trim());
        }
    }

    return registry;
}

function resolveConfig(options?: SCloudConfig) {
    const bucket = options?.bucket || "";
    let apiKey = options?.apiKey || "";

    if (bucket && !apiKey) {
        const registry = getKeysFromConvar();
        const foundKey = registry.get(bucket);
        if (foundKey) {
            apiKey = foundKey;
        }
    }

    if (!bucket) throw new Error('sCloud configuration error: Missing bucket name. Provide one in options.');
    if (!apiKey) throw new Error(`sCloud configuration error: No API Key found for bucket "${bucket}". Ensure SCLOUD_BUCKETS convar is set correctly on the server.`);

    return { bucket, apiKey };
}

const UploadResponseSchema = v.object({
    success: v.boolean(),
    url: v.optional(v.string()),
    error: v.optional(v.string()),
});

export async function requestPresignedUrl(path: string, options?: SCloudConfig): Promise<string> {
    const { bucket, apiKey } = resolveConfig(options);
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const url = `${CDN_BASE_URL}/api/presigned-url?bucketName=${bucket}&path=${cleanPath}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'x-api-key': apiKey,
        },
    });

    if (!res.ok) {
        throw new Error(`sCloud API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const result = v.parse(UploadResponseSchema, data);

    if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to get presigned URL');
    }

    return result.url;
}

export async function uploadImage(buffer: Buffer, path: string, options?: SCloudConfig): Promise<{ url: string }> {
    const { bucket, apiKey } = resolveConfig(options);

    const form = new FormData();
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fileName = options?.name || 'upload.png';
    const useRandom = !options?.name;
    const uploadUrl = `${CDN_BASE_URL}/${bucket}/${cleanPath}?randomizeName=${useRandom}`;

    form.append('files', buffer, fileName);

    const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            ...form.getHeaders(),
            'x-api-key': apiKey,
        },
        body: form as any,
    });

    if (!res.ok) {
        throw new Error(`sCloud API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const result = v.parse(UploadResponseSchema, data);

    if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to upload image');
    }

    return { url: result.url };
}
