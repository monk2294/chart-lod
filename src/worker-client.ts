import { SimplifyParams } from './worker';
import { packToArrayBuffer, unpackFromArrayBuffer } from './typedArrays';

export function createWorkerClient(workerOrString: Worker | string) {
    let worker = typeof workerOrString === 'string' ? new Worker(workerOrString) : workerOrString;

    const messageQueue: Array<any[]> = [];
    const serveQueue = () => {
        const messageSeq = messageQueue.shift();
        if (messageSeq) {
            messageSeq.forEach(msg => {
                if (msg instanceof ArrayBuffer) {
                    worker.postMessage(msg, [msg]);
                } else {
                    worker.postMessage(msg);
                }
            });
            serveQueue();
        }
    };

    const wc = {
        execute: {
            simplify: (params: SimplifyParams, data: [number, number][]) => {
                messageQueue.push([
                    { cmd: 'simplify' },
                    params,
                    packToArrayBuffer(data),
                ]);
                serveQueue();
            },
            simplifyAndMerge: (params: SimplifyParams, data: [number, number][], baseLOD: [number, number][]) => {
                messageQueue.push([
                    { cmd: 'simplifyAndMerge' },
                    params,
                    packToArrayBuffer(data),
                    packToArrayBuffer(baseLOD),
                ]);
                serveQueue();
            },
        },
        onData: (data: [number, number][]) => {},
    };
    worker.onmessage = event => {
        if (event.data instanceof ArrayBuffer) {
            wc.onData(unpackFromArrayBuffer(event.data));
        } else {
            wc.onData(event.data);
        }
    };

    return wc;
}