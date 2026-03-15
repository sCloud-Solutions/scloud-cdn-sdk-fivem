import { requestClientScreenshot } from './screenshot';
import { requestPresignedUrl, uploadImage, SCloudConfig } from './api';

setImmediate(() => {
    console.log(`^2[sCloud SDK]^0 Resource starting (Mode: Exclusive Convar)...`);

    const bucketsRaw = GetConvar('SCLOUD_BUCKETS', '');
    if (!bucketsRaw || bucketsRaw === '') {
        console.log(`^3[sCloud SDK]^0 Warning: SCLOUD_BUCKETS convar is not set! Set it in your server.cfg like: set SCLOUD_BUCKETS "name:key"`);
    } else {
        const count = bucketsRaw.split(',').length;
        console.log(`^2[sCloud SDK]^0 Successfully detected ^3${count}^0 registered buckets.`);
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
    timeout?: number;
}

exports('__takeServerScreenshot', (playerSrc: string | number, options: LuaOptions, cb: Function) => {
    const path = options.path || "";
    const timeout = options.timeout || 10000;

    requestClientScreenshot(playerSrc, path, options, timeout)
        .then(url => { if (cb) cb({ url }); })
        .catch(() => { if (cb) cb(null); });
});

exports('__requestPresignedUrl', (options: LuaOptions, cb: Function) => {
    const path = options.path || "";
    requestPresignedUrl(path, options)
        .then(url => { if (cb) cb({ url }); })
        .catch(() => { if (cb) cb(null); });
});

exports('__uploadImage', (buffer: Buffer, options: LuaOptions, cb: Function) => {
    const path = options.path || "";
    uploadImage(buffer, path, options)
        .then(url => { if (cb) cb({ url }); })
        .catch(() => { if (cb) cb(null); });
});
