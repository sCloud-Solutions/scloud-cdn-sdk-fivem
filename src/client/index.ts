interface TakeScreenshotResponse {
    success: boolean;
    url?: string;
    error?: string;
}

interface SCloudOptions {
    bucket?: string;
    apiKey?: string;
    path?: string;
    name?: string;
}

let requestCounter = 0;

export function __takeScreenshot(options: SCloudOptions, cb: (result: any) => void): void {
    requestCounter++;
    const currentId = requestCounter;

    const path = options.path || "";
    const rpcOptions = {
        bucket: options.bucket,
        apiKey: options.apiKey,
        name: options.name
    };

    const timeout = setTimeout(() => {
        console.log(`^3[sCloud SDK]^0 Request ${currentId} timed out.`);
        removeEventListener('scloud:takeScreenshotResponse', eventHandler);
        if (cb) cb(null);
    }, 15000);

    const eventHandler = (id: number, response: TakeScreenshotResponse) => {
        if (id !== currentId) return;

        clearTimeout(timeout);
        removeEventListener('scloud:takeScreenshotResponse', eventHandler);

        if (response.success && response.url) {
            if (cb) cb({ url: response.url });
        } else {
            console.log(`^1[sCloud SDK]^0 Request ${id} failed: ${response.error}`);
            if (cb) cb(null);
        }
    };

    onNet('scloud:takeScreenshotResponse', eventHandler);
    emitNet('scloud:takeScreenshot', currentId, path, rpcOptions);
}

exports('__takeScreenshot', __takeScreenshot);
