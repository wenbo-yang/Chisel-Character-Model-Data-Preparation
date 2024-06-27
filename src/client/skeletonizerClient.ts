import Jimp from 'jimp';
import { IDataPreparationServiceConfig, ISkeletonizerClient } from '../types/dataPreparerTypes';
import { DataPreparationServiceConfig } from '../config';

export class SkeletonizerClient implements ISkeletonizerClient {
    private config: IDataPreparationServiceConfig;
    constructor(config?: IDataPreparationServiceConfig) {
        this.config = config || new DataPreparationServiceConfig();
    }

    public async skeletonize(image: Jimp, outputHeight: number, outputWidth: number): Promise<Jimp> {
        throw new Error('not implemented');
    }
}
