// import { SkeletonizationServiceConfig } from '../config';
// import { ISkeletonizationServiceConfig, SkeletonizeProcessor } from '../types/skeletonizeTypes';
// import { convert2DMatToString } from './imageProcessor/matUtilities';
// import { SkeletonizeProcessorFactory } from './imageProcessor/skeletonizeProcessorFactory';

// export class Skeletonizer {
//     private skeletonizeProcessor: SkeletonizeProcessor;
//     private config: ISkeletonizationServiceConfig;

//     constructor(config?: ISkeletonizationServiceConfig, skeletonizeProcessor?: SkeletonizeProcessor) {
//         this.config = config || new SkeletonizationServiceConfig();
//         this.skeletonizeProcessor = skeletonizeProcessor || SkeletonizeProcessorFactory.makeSkeletonizeProcessor(this.config);
//     }

//     public async skeletonizeImage(binaryMat: Array<number[]>): Promise<string> {
//         const skeleton = await this.skeletonizeProcessor.thinning(binaryMat);
//         return convert2DMatToString(skeleton);
//     }
// }
