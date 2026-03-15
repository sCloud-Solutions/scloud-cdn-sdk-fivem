import { uploadImage, SCloudConfig } from './api';

export async function requestClientScreenshot(
    playerSrc: string | number,
    path: string,
    options?: SCloudConfig,
    timeoutMs: number = 10000
): Promise<string> {
    if (!exports['screenshot-basic']) {
        throw new Error('Screenshot-basic resource is not running. Please ensure it is started.');
    }

    return new Promise((resolve, reject) => {
        let timeoutId: NodeJS.Timeout | undefined;

        if (timeoutMs > 0) {
            timeoutId = setTimeout(() => {
                reject(new Error(`Screenshot request timed out after ${timeoutMs}ms.`));
            }, timeoutMs);
        }

        exports['screenshot-basic'].requestClientScreenshot(
            playerSrc,
            { encoding: 'webp', quality: 0.8 },
            async (err: string | false, data: string) => {
                if (timeoutId) clearTimeout(timeoutId);

                if (err) {
                    return reject(new Error(`Screenshot failed: ${err}`));
                }

                try {
                    const base64String = data.split(',')[1] ?? '';
                    const buffer = Buffer.from(base64String, 'base64');

                    const uploadedUrl = await uploadImage(buffer, path, options);
                    resolve(uploadedUrl);
                } catch (e) {
                    reject(e);
                }
            }
        );
    });
}
