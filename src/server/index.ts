import { requestClientScreenshot } from './screenshot';
import { requestPresignedUrl, uploadImage, SCloudConfig } from './api';

setImmediate(() => {
    const defaultBucket = GetConvar('SCLOUD_DEFAULT_BUCKET', '');
    const defaultApiKey = GetConvar('SCLOUD_DEFAULT_API_KEY', '');

    if (defaultBucket && defaultApiKey) {
        console.log(`^2[sCloud SDK]^0 Successfully initialized for bucket: ^3${defaultBucket}^0`);
    } else {
        console.log(`^3[sCloud SDK]^0 Warning: SCLOUD_DEFAULT_BUCKET or SCLOUD_DEFAULT_API_KEY convars are missing. You must provide them per-request.`);
    }
});

onNet('scloud:takeScreenshot', async (id: number, path: string, options?: SCloudConfig & { name?: string }) => {
    const src = global.source;

    try {
        const url = await requestClientScreenshot(src, path, options);
        emitNet('scloud:takeScreenshotResponse', src, id, { success: true, url });
    } catch (e) {
        let msg = 'Unknown Error';
        if (e instanceof Error) msg = e.message;
        emitNet('scloud:takeScreenshotResponse', src, id, { success: false, error: msg });
    }
});

interface LuaOptions extends SCloudConfig {
    path?: string;
    name?: string;
}

exports('__takeServerScreenshot', (playerSrc: string | number, pathOverride: string, options: LuaOptions, timeoutOverride: number, cb: Function) => {
    const path = options.path || pathOverride || "";
    const timeout = timeoutOverride || 10000;

    requestClientScreenshot(playerSrc, path, options, timeout)
        .then(url => { if (cb) cb({ url }); })
        .catch(() => { if (cb) cb(null); });
});

exports('__requestPresignedUrl', (pathOverride: string, options: LuaOptions, cb: Function) => {
    const path = options.path || pathOverride || "";
    requestPresignedUrl(path, options)
        .then(url => { if (cb) cb(url); })
        .catch(() => { if (cb) cb(null); });
});

exports('__uploadImage', (buffer: Buffer, pathOverride: string, options: LuaOptions, cb: Function) => {
    const path = options.path || pathOverride || "";
    uploadImage(buffer, path, options)
        .then(url => { if (cb) cb({ url }); })
        .catch(() => { if (cb) cb(null); });
});
