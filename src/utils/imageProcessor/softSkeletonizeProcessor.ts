// import { SkeletonizationServiceConfig } from '../../config';
// import { ISkeletonizationServiceConfig, SkeletonizeProcessor } from '../../types/skeletonizeTypes';
// import { zsThinning } from './zsThinning';

// export class SoftSkeletonizeProcessor implements SkeletonizeProcessor {
//     private config: ISkeletonizationServiceConfig;

//     constructor(config?: ISkeletonizationServiceConfig) {
//         this.config = config || new SkeletonizationServiceConfig();
//     }

//     public async thinning(binaryMat: Array<number[]>): Promise<Array<number[]>> {
//         // const startTime = Date.now();
//         let mat: number[][] = binaryMat.map((row) => row.slice());
//         mat = zsThinning(mat);
//         // const endTime = Date.now();
//         // console.log("Done: took " + (endTime - startTime) + "ms");
//         return mat;
//     }
// }
