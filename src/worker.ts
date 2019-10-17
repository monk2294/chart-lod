import { unpackFromArrayBuffer, packToArrayBuffer } from './typedArrays';
import { simplifyDataForChart } from '.';
import { mergeSimplifiedLines } from './lib';

export interface SimplifyParams {
    from: number;
    to: number;
    chartWidth: number;
}

export interface WorkerState<T = any, D = any> {
    command: string;
    meta: T;
    data: D[];
}

interface CommandMap {
    [command: string]: Array<(data: any, state: WorkerState) => any>;
}

interface Command {
    cmd: string;
}

const workerCommands = {
    simplify: [
        (data: SimplifyParams, state: WorkerState) => {
            state.meta = data;
        },
        (data: ArrayBuffer, state: WorkerState<SimplifyParams>) => {
            const unpackedData = unpackFromArrayBuffer(data);
            return simplifyDataForChart(unpackedData, state.meta.from, state.meta.to, state.meta.chartWidth);
        }
    ],
    simplifyAndMerge: [
        (data: SimplifyParams, state: WorkerState) => {
            state.meta = data;
        },
        (data: ArrayBuffer, state: WorkerState<SimplifyParams, [number, number][]>) => {
            state.data.push(unpackFromArrayBuffer(data)); // raw data
        },
        (data: ArrayBuffer, state: WorkerState<SimplifyParams, [number, number][]>) => {
            state.data.push(unpackFromArrayBuffer(data)); // base LOD data
            const lod = simplifyDataForChart(state.data[0], state.meta.from, state.meta.to, state.meta.chartWidth);
            return mergeSimplifiedLines(state.data[1], lod);
        },
    ],
};

export function createMessageListener() {
    const commands = workerCommands as CommandMap;
    let currentCommand: string | null = null;
    let currentCommandHandlerIndex: number = 0;
    let currentCommandState: WorkerState | null = null;
    return (event: MessageEvent) => {
        if (event.data.cmd) { // TODO: correct command identifier
            const userCommand = event.data as Command;
            if (currentCommand) {
                throw new Error('Cannot start execution of new command while old is not finished');
            }
            currentCommand = userCommand.cmd;
            currentCommandHandlerIndex = 0;
            currentCommandState = {
                command: currentCommand,
                meta: {},
                data: [],
            };
            console.time(currentCommand);
        } else if (currentCommand && currentCommandState) {
            const handler = commands[currentCommand][currentCommandHandlerIndex++];
            if (!handler) {
                throw new Error('Last command was reached but truthy value was not returned');
            }
            const executionResult = handler(event.data, currentCommandState);
            if (executionResult) {
                // Last command in command queue detected
                sendToClient(packToArrayBuffer(executionResult));
                console.timeEnd(currentCommand);
                currentCommand = null;
                currentCommandHandlerIndex = 0;
                currentCommandState = null;
            }
        }
    };
}

function sendToClient(buffer: ArrayBuffer): void {
    // @ts-ignore
    postMessage(buffer, [buffer]);
}
