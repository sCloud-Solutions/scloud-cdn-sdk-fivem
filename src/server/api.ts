import fetch from 'cross-fetch';
import FormData from 'form-data';
import * as v from 'valibot';

const CDN_BASE_URL = 'https://cdn.sacul.cloud';

export interface SCloudConfig {
    bucket?: string;
    apiKey?: string;
    name?: string;
}

function resolveConfig(options?: SCloudConfig) {
    const bucket = options?.bucket || GetConvar('SCLOUD_DEFAULT_BUCKET', '');
    const apiKey = options?.apiKey || GetConvar('SCLOUD_DEFAULT_API_KEY', '');

    if (!bucket) throw new Error('sCloud configuration error: Missing bucket name. Provide one in options or set SCLOUD_DEFAULT_BUCKET convar.');
    if (!apiKey) throw new Error('sCloud configuration error: Missing API Key. Provide one in options or set SCLOUD_DEFAULT_API_KEY convar.');

    return { bucket, apiKey };
}

const PresignedResponseSchema = v.object({
    success: v.boolean(),
    url: v.string(),
    expiresIn: v.optional(v.number())
});

export async function requestPresignedUrl(path: string, options?: SCloudConfig): Promise<string> {
    const { apiKey } = resolveConfig(options);

    const url = new URL(`${CDN_BASE_URL}/api/presigned-url`);
    url.searchParams.append('path', path);
    url.searchParams.append('randomizeName', 'true');

    const res = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    });

    if (!res.ok) {
        throw new Error(`sCloud API Error (${res.status}): Failed to request presigned URL.`);
    }

    const json = await res.json();
    const parsed = v.parse(PresignedResponseSchema, json);

    if (!parsed.success || !parsed.url) {
        throw new Error('sCloud API Error: Presigned URL request returned an unsuccessful state.');
    }

    return parsed.url;
}

const UploadResponseSchema = v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
    url: v.optional(v.string()),
    urls: v.optional(v.array(v.string()))
});

export async function uploadImage(buffer: Buffer, path: string, options?: SCloudConfig): Promise<string> {
    const { bucket, apiKey } = resolveConfig(options);

    const form = new FormData();

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const fileName = options?.name || 'upload.png';
    const useRandom = !options?.name;
    const uploadUrl = `${CDN_BASE_URL}/${bucket}/${cleanPath}?randomizeName=${useRandom}`;

    form.append('files', buffer, fileName);

    const res = await fetch(uploadUrl, {
        method: 'POST',
        body: form as any,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            ...form.getHeaders()
        }
    });

    if (!res.ok) {
        throw new Error(`sCloud API Error (${res.status}): Failed to upload image directly.`);
    }

    const json = await res.json();
    const parsed = v.parse(UploadResponseSchema, json);

    if (!parsed.success || !parsed.url) {
        throw new Error('sCloud API Error: Upload was reported unsuccessful by the server or missing url in response.');
    }

    return parsed.url;
}
