// // fast removal and adding of points

// import { Point } from '../../types/skeletonizeTypes';

// export class PointSet {
//     private offset: number;
//     private points: Set<number>;
//     constructor(offset?: number) {
//         this.offset = offset || 10000;
//         this.points = new Set();
//     }

//     public get length(): number {
//         return this.points.size;
//     }

//     public has(point: Point): boolean {
//         return this.points.has((point.r + 1) * this.offset + point.c);
//     }

//     public add(point: Point): void {
//         this.points.add((point.r + 1) * this.offset + point.c);
//     }

//     public remove(point: Point): void {
//         this.points.delete((point.r + 1) * this.offset + point.c);
//     }

//     public getValues(): Point[] {
//         const retVal: Point[] = [];

//         this.points.forEach((v) => {
//             const r = Math.floor(v / this.offset);
//             const c = v - r * this.offset;
//             retVal.push({ r: r - 1, c });
//         });

//         return retVal;
//     }
// }
