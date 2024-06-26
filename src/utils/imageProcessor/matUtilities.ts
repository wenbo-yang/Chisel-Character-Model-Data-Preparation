// import { decode } from 'bmp-js';
// import { BitMapBuffer } from '../bitMapBuffer';
// import { Point } from '../../types/skeletonizeTypes';

// export async function convertDataToZeroOneMat(bitMapBuffer: BitMapBuffer, grayScaleWhiteThreshold: number): Promise<number[][]> {
//     const bmpData = decode(bitMapBuffer.imageBuffer);
//     const mat: number[][] = [];

//     let index = 0;

//     for (let i = 0; i < bmpData.height; i++) {
//         const row: number[] = [];
//         for (let j = 0; j < bmpData.width; j++) {
//             if (i === 0 || i === bmpData.height - 1 || j === 0 || j === bmpData.width - 1) {
//                 // make sure edges are cleared
//                 row.push(0);
//             } else if (bmpData.data[index + 1] > grayScaleWhiteThreshold) {
//                 row.push(0);
//             } else if (bmpData.data[index + 1] <= grayScaleWhiteThreshold) {
//                 row.push(1);
//             }
//             index += 4;
//         }

//         mat.push(row);
//     }

//     return mat;
// }

// export function logMat(mat: Array<number[]>): void {
//     const row = mat.length;
//     let output = '';
//     for (let i = 0; i < row; i++) {
//         output += mat[i].join('') + '\n';
//     }

//     console.log(output);
// }

// export function convert2DMatToString(skeleton: number[][]): string {
//     let output = '';

//     for (let i = 0; i < skeleton.length; i++) {
//         for (let j = 0; j < skeleton[0].length; j++) {
//             output += skeleton[i][j].toString();
//         }
//         if (i != skeleton.length - 1) {
//             output += '\n';
//         }
//     }

//     return output;
// }

// export function trimBinaryMat(mat: number[][]): number[][] {
//     const offsets = getOffsetsFromMat(mat);
//     let trimmedMat: Array<Array<number>> = generate2DMatrix(offsets[1].r - offsets[0].r + 3, offsets[1].c - offsets[0].c + 3);

//     for (let i = 1; i < trimmedMat.length - 1; i++) {
//         for (let j = 1; j < trimmedMat[0].length - 1; j++) {
//             trimmedMat[i][j] = mat[i + offsets[0].r][j + offsets[0].c];
//         }
//     }

//     return trimmedMat;
// }

// export function getOffsetsFromPointList(points: Point[]): Point[] {
//     let top = Number.MAX_VALUE;
//     let bottom = Number.MIN_VALUE;
//     let right = Number.MIN_VALUE;
//     let left = Number.MAX_VALUE;

//     for (let i = 0; i < points.length; i++) {
//         top = Math.min(points[i].r, top);
//         bottom = Math.max(points[i].r, bottom);
//         left = Math.min(points[i].c, left);
//         right = Math.max(points[i].c, right);
//     }

//     return [
//         { r: top, c: left },
//         { r: bottom, c: right },
//     ];
// }

// export function getOffsetsFromMat(mat: number[][]): Point[] {
//     let top = Number.MAX_VALUE;
//     let bottom = Number.MIN_VALUE;
//     let right = Number.MIN_VALUE;
//     let left = Number.MAX_VALUE;

//     for (let i = 0; i < mat.length; i++) {
//         for (let j = 0; j < mat[0].length; j++) {
//             if (mat[i][j] === 1) {
//                 top = Math.min(i, top);
//                 bottom = Math.max(i, bottom);
//                 left = Math.min(j, left);
//                 right = Math.max(j, right);
//             }
//         }
//     }

//     return [
//         { r: top, c: left },
//         { r: bottom, c: right },
//     ];
// }

// export function generate2DMatrix(numRows: number, numCols: number, initValue: number = 0): number[][] {
//     // prettier-ignore
//     return Array<Array<number>>(numRows).fill([]).map(() => Array<number>(numCols).fill(initValue));
// }
