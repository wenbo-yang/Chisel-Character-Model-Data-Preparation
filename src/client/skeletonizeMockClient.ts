import Jimp from 'jimp';
import { IDataPreparationServiceConfig, ISkeletonizerClient } from '../types/dataPreparerTypes';
import { DataPreparationServiceConfig } from '../config';
import * as skeletonized from './output_zou_character_denoised_prepared.json';
import { ungzip } from 'node-gzip';

export class SkeletonizerMockClient implements ISkeletonizerClient {
    private config: IDataPreparationServiceConfig;
    constructor(config?: IDataPreparationServiceConfig) {
        this.config = config || new DataPreparationServiceConfig();
    }

    public async skeletonize(image: Jimp, outputHeight: number, outputWidth: number): Promise<Jimp> {
        const buffer = await ungzip(Buffer.from(skeletonized.transformedData[2].strokeImage, 'base64'));
        const outputImage = await Jimp.read(buffer);
        return outputImage;
    }
}
