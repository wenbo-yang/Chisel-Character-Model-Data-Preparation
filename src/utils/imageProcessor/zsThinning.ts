// import { Point } from '../../types/skeletonizeTypes';
// import { PointSet } from './pointSet';

// export function zsThinning(mat: number[][]): number[][] {
//     let pointsToRemove: Point[] = [];
//     const blackPoints: PointSet = getBlackPointFromMat(mat);

//     do {
//         pointsToRemove = [];
//         pointsToRemove = zsThinnigGetTargetPointsStep1(mat, blackPoints);
//         removePoints(mat, blackPoints, pointsToRemove);

//         pointsToRemove = zsThinnigGetTargetPointsStep2(mat, blackPoints);
//         removePoints(mat, blackPoints, pointsToRemove);
//     } while (pointsToRemove.length !== 0);

//     return mat;
// }

// export function zsThinnigGetTargetPointsStep1WithRemovalMat(mat: number[][], blackPoints: PointSet, removalMat: number[][]): boolean {
//     let hasPointsToRemove = false;

//     const pointsToTest = blackPoints.getValues();
//     for (let k = 0; k < pointsToTest.length; k++) {
//         const i = pointsToTest[k].r;
//         const j = pointsToTest[k].c;
//         if (isNotOnTheEdge(mat, i, j) && isThisATargetToRemoveStep1(mat, i, j, getNeighborValues(mat, i, j))) {
//             removalMat[i][j] = 0;
//             hasPointsToRemove = true;
//         }
//     }

//     return hasPointsToRemove;
// }

// export function zsThinnigGetTargetPointsStep2WithRemovalMat(mat: number[][], blackPoints: PointSet, removalMat: number[][]): boolean {
//     let hasPointsToRemove = false;

//     const pointsToTest = blackPoints.getValues();
//     for (let k = 0; k < pointsToTest.length; k++) {
//         const i = pointsToTest[k].r;
//         const j = pointsToTest[k].c;
//         if (isNotOnTheEdge(mat, i, j) && isThisATargetToRemoveStep2(mat, i, j, getNeighborValues(mat, i, j))) {
//             removalMat[i][j] = 0;
//             hasPointsToRemove = true;
//         }
//     }

//     return hasPointsToRemove;
// }

// export function getBlackPointFromMat(mat: number[][]): PointSet {
//     const blackPoints = new PointSet();
//     const row = mat.length;
//     const col = mat[0].length;

//     for (let i = 0; i < row; i++) {
//         for (let j = 0; j < col; j++) {
//             if (mat[i][j] === 1) {
//                 blackPoints.add({ r: i, c: j });
//             }
//         }
//     }

//     return blackPoints;
// }

// function zsThinnigGetTargetPointsStep1(mat: number[][], blackPoints: PointSet): Point[] {
//     const result: Point[] = [];
//     const pointsToTest = blackPoints.getValues();
//     for (let k = 0; k < pointsToTest.length; k++) {
//         const i = pointsToTest[k].r;
//         const j = pointsToTest[k].c;

//         if (isNotOnTheEdge(mat, i, j) && isThisATargetToRemoveStep1(mat, i, j, getNeighborValues(mat, i, j))) {
//             result.push({ r: i, c: j });
//         }
//     }

//     return result;
// }

// function zsThinnigGetTargetPointsStep2(mat: number[][], blackPoints: PointSet): Point[] {
//     const result: Point[] = [];
//     const pointsToTest = blackPoints.getValues();
//     for (let k = 0; k < pointsToTest.length; k++) {
//         const i = pointsToTest[k].r;
//         const j = pointsToTest[k].c;
//         if (isNotOnTheEdge(mat, i, j) && isThisATargetToRemoveStep2(mat, i, j, getNeighborValues(mat, i, j))) {
//             result.push({ r: i, c: j });
//         }
//     }

//     return result;
// }

// function isThisATargetToRemoveStep2(mat: number[][], r: number, c: number, neighbors: number[]) {
//     if (mat[r][c] === 1) {
//         const sumInRange = sumOfNeighborsInRemovalRange(neighbors);
//         const numTransIsOne = numberOfTransitionsIsInRemovalRange(neighbors);
//         const atLeastOneNeighborIsBlank = isAtLeastOneNumberBlankStep2(neighbors);
//         return sumInRange && numTransIsOne && atLeastOneNeighborIsBlank;
//     }

//     return false;
// }

// function isThisATargetToRemoveStep1(mat: number[][], r: number, c: number, neighbors: number[]): boolean {
//     if (mat[r][c] === 1) {
//         const sumInRange = sumOfNeighborsInRemovalRange(neighbors);
//         const numTransIsOne = numberOfTransitionsIsInRemovalRange(neighbors);
//         const atLeastOneNeighborIsBlank = isAtLeastOneNumberBlankStep1(neighbors);
//         return sumInRange && numTransIsOne && atLeastOneNeighborIsBlank;
//     }

//     return false;
// }

// function isNotOnTheEdge(mat: number[][], i: number, j: number) {
//     const row = mat.length;
//     const col = mat[0].length;

//     if (i == 0 || j == 0 || i == row - 1 || j == col - 1) {
//         return false;
//     }

//     return true;
// }

// function getNeighborValues(mat: number[][], r: number, c: number): number[] {
//     return [mat[r - 1][c], mat[r - 1][c + 1], mat[r][c + 1], mat[r + 1][c + 1], mat[r + 1][c], mat[r + 1][c - 1], mat[r][c - 1], mat[r - 1][c - 1]];
// }

// function sumOfNeighborsInRemovalRange(neighbors: number[]): boolean {
//     let sum = 0;
//     for (let i = 0; i < neighbors.length; i++) {
//         sum += neighbors[i];
//     }

//     return sum <= 6 && sum >= 2;
// }

// function numberOfTransitionsIsInRemovalRange(neighbors: number[]): boolean {
//     const trans = (neighbors[0] === 0 && neighbors[1] === 1 ? 1 : 0) + (neighbors[1] === 0 && neighbors[2] === 1 ? 1 : 0) + (neighbors[2] === 0 && neighbors[3] === 1 ? 1 : 0) + (neighbors[3] === 0 && neighbors[4] === 1 ? 1 : 0) + (neighbors[4] === 0 && neighbors[5] === 1 ? 1 : 0) + (neighbors[5] === 0 && neighbors[6] === 1 ? 1 : 0) + (neighbors[6] === 0 && neighbors[7] === 1 ? 1 : 0) + (neighbors[7] === 0 && neighbors[0] === 1 ? 1 : 0);

//     return trans === 1;
// }

// function isAtLeastOneNumberBlankStep1(neighbors: number[]): boolean {
//     const neighborBlankCondition1 = neighbors[0] === 0 || neighbors[2] === 0 || neighbors[4] === 0;
//     const neighborBlankCondition2 = neighbors[2] === 0 || neighbors[4] === 0 || neighbors[6] === 0;

//     return neighborBlankCondition1 && neighborBlankCondition2;
// }

// function isAtLeastOneNumberBlankStep2(neighbors: number[]): boolean {
//     const neighborBlankCondition1 = neighbors[0] === 0 || neighbors[2] === 0 || neighbors[6] === 0;
//     const neighborBlankCondition2 = neighbors[0] === 0 || neighbors[4] === 0 || neighbors[7] === 0;

//     return neighborBlankCondition1 && neighborBlankCondition2;
// }

// function removePoints(mat: number[][], blackPoints: PointSet, pointsToRemove: Point[]): void {
//     pointsToRemove.forEach((p) => {
//         mat[p.r][p.c] = 0;
//         blackPoints.remove(p);
//     });
// }
