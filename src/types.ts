export type ValuablePoint = [number, number] | { x: number, y: number };

export type Point = ValuablePoint | [number, null];

export type RawPoint = Point | undefined;

export type ValuableData = ValuablePoint[];

export type Data = Point[];

export type RawData = RawPoint[];
