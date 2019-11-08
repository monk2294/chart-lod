export declare type ValuablePoint = [number, number] | {
    x: number;
    y: number;
};
export declare type Point = ValuablePoint | [number, null];
export declare type RawPoint = Point | undefined;
export declare type ValuableData = ValuablePoint[];
export declare type Data = Point[];
export declare type RawData = RawPoint[];
