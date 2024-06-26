// import { SkeletonizationServiceConfig } from '../../config';
// import { ISkeletonizationServiceConfig, SkeletonizeProcessor } from '../../types/skeletonizeTypes';
// import { GPU } from 'gpu.js';
// import { getBlackPointFromMat, zsThinnigGetTargetPointsStep1WithRemovalMat, zsThinnigGetTargetPointsStep2WithRemovalMat } from './zsThinning';
// import { generate2DMatrix } from './matUtilities';

// // NOTE: THIS IS NOT FASTER THAN CPU FOR OUR APPLICATION
// // WILL NOT USE THIS for V1
// // Manipulating matrix element breaks GPU rule.
// // We are generating a removal mat and & operate that with target mat
// // We are looking at 100x100 mat operation this is not going to be faster than cpu.

// export class GpuSkeletonizeProcessor implements SkeletonizeProcessor {
//     private config: ISkeletonizationServiceConfig;

//     constructor(config?: ISkeletonizationServiceConfig) {
//         this.config = config || new SkeletonizationServiceConfig();
//     }

//     public async thinning(binaryMat: Array<number[]>): Promise<Array<number[]>> {
//         // const startTime = Date.now();
//         let mat: number[][] = binaryMat.map((row) => row.slice());
//         let removalMat: number[][] = generate2DMatrix(mat.length, mat[0].length, 1);

//         const gpu = new GPU();
//         const gpuRemovalMat = gpu
//             .createKernel(function (mat: number[][], removalMat: number[][]) {
//                 const out = mat[this.thread.y][this.thread.x] & removalMat[this.thread.y][this.thread.x];
//                 return out;
//             })
//             .setPrecision('single')
//             .setOutput([mat[0].length, mat.length]);

//         let hasPointsToRemove = false;
//         const blackPoints = getBlackPointFromMat(mat);
//         do {
//             hasPointsToRemove = zsThinnigGetTargetPointsStep1WithRemovalMat(mat, blackPoints, removalMat);
//             mat = gpuRemovalMat(mat, removalMat) as number[][];

//             hasPointsToRemove = zsThinnigGetTargetPointsStep2WithRemovalMat(mat, blackPoints, removalMat);
//             mat = gpuRemovalMat(mat, removalMat) as number[][];
//         } while (hasPointsToRemove);

//         // const endTime = Date.now();
//         // console.log('Done: took ' + (endTime - startTime) + 'ms');

//         const retMat = this.convertToNumberMat(mat);

//         return retMat;
//     }

//     private convertToNumberMat(mat: number[][]) {
//         const numberMat: number[][] = generate2DMatrix(mat.length, mat[0].length);

//         for (let i = 0; i < mat.length; i++) {
//             for (let j = 0; j < mat[0].length; j++) {
//                 numberMat[i][j] = mat[i][j];
//             }
//         }

//         return numberMat;
//     }
// }
