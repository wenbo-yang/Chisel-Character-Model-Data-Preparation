import { DATAPREPARATIONMETHODS, DataPreparationRequestBody, IDataPreparationServiceConfig, ISkeletonizerClient, PreparedData } from '../types/dataPreparerTypes';
import { BoundingRect, COMPRESSIONTYPE, IMAGEDATATYPE } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import { findBoundingRect, resizeImage } from '../../Chisel-Global-Common-Libraries/src/lib/imageUtils';
import { SkeletonizerClient } from '../client/skeletonizerClient';
import { ungzip } from 'node-gzip';
import Jimp from 'jimp';
import { ColorActionName } from '@jimp/plugin-color/index';
import { DataPreparationServiceConfig } from '../config';

export class DataPreparerModel {
    private config: IDataPreparationServiceConfig;
    private skeletonizer: ISkeletonizerClient;

    constructor(config?: IDataPreparationServiceConfig, skeletonizer?: ISkeletonizerClient) {
        this.config = config || new DataPreparationServiceConfig();
        this.skeletonizer = skeletonizer || new SkeletonizerClient();
    }

    public async prepare(body: DataPreparationRequestBody): Promise<PreparedData[]> {
        if (body.originalImageType !== IMAGEDATATYPE.PNG) {
            throw new Error('image type other than PNG is not supported for now');
        }

        const originalImage = await this.getJimpImage(body);
        const filteredImage = originalImage.color([{ apply: ColorActionName.DESATURATE, params: [90] }]).contrast(1);
        const boundingRect = findBoundingRect(filteredImage, this.config.grayScaleWhiteThreshold);
        const resizedImage = resizeImage(filteredImage, boundingRect, 1, body.outputHeight, body.outputWidth);
        const skeleton = await this.getSkeleton(filteredImage, body.outputHeight, body.outputWidth);
        const boldStroke = this.boldStroke(skeleton);
        const tiltedSkeletonImages = this.tilt(skeleton);
        const tiltedBoldStrokeImages = this.tilt(boldStroke);

        const preparedData: PreparedData[] = [];
        preparedData.concat(await this.convertJimpImageToPreparedData(resizedImage, [DATAPREPARATIONMETHODS.ORIGINAL], body.outputCompression, boundingRect, body.outputHeight, body.outputWidth));
        preparedData.concat(await this.convertJimpImageToPreparedData(skeleton, [DATAPREPARATIONMETHODS.SKELETON], body.outputCompression, boundingRect, body.outputHeight, body.outputWidth));
        preparedData.concat(await this.convertJimpImageToPreparedData(boldStroke, [DATAPREPARATIONMETHODS.BOLDSTROKE], body.outputCompression, boundingRect, body.outputHeight, body.outputWidth));
        preparedData.concat(await tiltedSkeletonImages);
        preparedData.concat(await tiltedBoldStrokeImages);

        return preparedData;
    }

    boldStroke(skeleton: Jimp): Jimp {
        throw new Error('Method not implemented.');
    }

    tilt(boldStroke: Jimp): Promise<PreparedData[]> {
        throw new Error('Method not implemented.');
    }

    convertJimpImageToPreparedData(image: Jimp, descriptions: DATAPREPARATIONMETHODS[], compression: COMPRESSIONTYPE, boundingRect: BoundingRect, outputHeight: number, outputWidth: number): Promise<PreparedData> {
        throw new Error('Method not implemented');
    }

    private async getSkeleton(filteredImage: Jimp, outputHeight: number, outputWidth: number): Promise<Jimp> {
        return await this.skeletonizer.skeletonize(filteredImage, outputHeight, outputWidth);
    }

    private async getJimpImage(body: DataPreparationRequestBody): Promise<Jimp> {
        const buffer = body.inputCompression === COMPRESSIONTYPE.GZIP ? await ungzip(Buffer.from(body.originalImage, 'base64')) : Buffer.from(body.originalImage, 'base64');
        return await Jimp.read(buffer);
    }
}
