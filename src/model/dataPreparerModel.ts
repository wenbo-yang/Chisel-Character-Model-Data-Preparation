import { DATAPREPARATIONMETHODS, DataPreparationRequestBody, IDataPreparationServiceConfig, ISkeletonizerClient, PreparedData, PreparedDataDesciption } from '../types/dataPreparerTypes';
import { BoundingRect, COMPRESSIONTYPE, IMAGEDATATYPE } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import { findBoundingRect, resizeImage } from '../../Chisel-Global-Common-Libraries/src/lib/imageUtils';
import { SkeletonizerClient } from '../client/skeletonizerClient';
import { gzip, ungzip } from 'node-gzip';
import Jimp from 'jimp';

import { DataPreparationServiceConfig } from '../config';
import { ColorActionName } from '@jimp/plugin-color';

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

        const denoisedImage = originalImage.color([{ apply: ColorActionName.SATURATE, params: [90] }]).contrast(1);
        const boundingRect = findBoundingRect(denoisedImage, this.config.grayScaleWhiteThreshold);
        const resizedImage = resizeImage(denoisedImage, boundingRect, 1, body.outputHeight, body.outputWidth);
        const skeleton = await this.getSkeleton(denoisedImage, body.outputHeight, body.outputWidth);
        const boldStroke = this.boldStroke(skeleton);
        const tiltedSkeletonImages = await this.tilt(skeleton, {description: DATAPREPARATIONMETHODS.SKELETON}, body.outputCompression, body.outputHeight, body.outputWidth);
        const tiltedBoldStrokeImages = await this.tilt(boldStroke, {description: DATAPREPARATIONMETHODS.BOLDSTROKE}, body.outputCompression, body.outputHeight, body.outputWidth);

        const preparedData: PreparedData[] = [];
        preparedData.push(await this.convertJimpImageToPreparedData(resizedImage, [{description: DATAPREPARATIONMETHODS.ORIGINAL}], body.outputCompression, boundingRect, body.outputHeight, body.outputWidth));
        preparedData.push(await this.convertJimpImageToPreparedData(skeleton, [{description: DATAPREPARATIONMETHODS.SKELETON}], body.outputCompression, boundingRect, body.outputHeight, body.outputWidth));
        preparedData.push(await this.convertJimpImageToPreparedData(boldStroke, [{description: DATAPREPARATIONMETHODS.BOLDSTROKE}], body.outputCompression, boundingRect, body.outputHeight, body.outputWidth));
        
        const returnData = preparedData.concat(tiltedSkeletonImages).concat(tiltedBoldStrokeImages);

        return returnData;
    }
    
    private async tilt(image: Jimp, description: PreparedDataDesciption, outputCompression: COMPRESSIONTYPE, outputHeight: number, outputWidth: number): Promise<PreparedData[]> {
        const leftTilt = new Jimp(image);
        const rightTilt = new Jimp(image);

        const preparedData: PreparedData[] = [];

        for(let i = 0; i < 4; i++) {
            leftTilt.rotate(5);
            const compositeImageLeft = new Jimp(leftTilt.getWidth(), leftTilt.getHeight(), 'white');
            compositeImageLeft.blit(leftTilt, 0, 0);
            const boundingRect = findBoundingRect(compositeImageLeft, this.config.grayScaleWhiteThreshold);
            const resizedImage = resizeImage(compositeImageLeft, boundingRect, 1, outputHeight, outputWidth);
            preparedData.push(await this.convertJimpImageToPreparedData(resizedImage, [{description: description.description}, {description: DATAPREPARATIONMETHODS.TILTED}], outputCompression, boundingRect, outputHeight, outputWidth));
        }
        
        for(let i = 0; i < 4; i++) {
            rightTilt.rotate(-5);
            const compositeImageRight = new Jimp(leftTilt.getWidth(), rightTilt.getHeight(), 'white');
            compositeImageRight.blit(rightTilt, 0, 0);
            const boundingRect = findBoundingRect(compositeImageRight, this.config.grayScaleWhiteThreshold);
            const resizedImage = resizeImage(compositeImageRight, boundingRect, 1, outputHeight, outputWidth);
            preparedData.push(await this.convertJimpImageToPreparedData(resizedImage, [{description: description.description}, {description: DATAPREPARATIONMETHODS.TILTED}], outputCompression, boundingRect, outputHeight, outputWidth));
        }

        return preparedData;
    }

    private boldStroke(image: Jimp): Jimp {
        const boldStroke = new Jimp(image);
        return boldStroke.blur(1).contrast(1);
    }

    private async convertJimpImageToPreparedData(image: Jimp, descriptions: PreparedDataDesciption[], compression: COMPRESSIONTYPE, boundingRect: BoundingRect, outputHeight: number, outputWidth: number): Promise<PreparedData> {
        const preparedData = compression === COMPRESSIONTYPE.GZIP ? (await gzip(await image.getBufferAsync(Jimp.MIME_PNG))).toString('base64') : (await image.getBufferAsync(Jimp.MIME_PNG)).toString('base64');

        return {
            preparedDataType: IMAGEDATATYPE.PNG,
            preparedDataCompression: compression,
            preparedData,
            preparedDataDescription: descriptions,
            preparedDataHeight: outputHeight,
            preparedDataWidth: outputWidth,
            originalBoundingRect: boundingRect // topleft is the offset from original image
        } as PreparedData;
    }

    private async getSkeleton(image: Jimp, outputHeight: number, outputWidth: number): Promise<Jimp> {
        return await this.skeletonizer.skeletonize(image, outputHeight, outputWidth);
    }

    private async getJimpImage(body: DataPreparationRequestBody): Promise<Jimp> {
        const buffer = body.inputCompression === COMPRESSIONTYPE.GZIP ? await ungzip(Buffer.from(body.originalImage, 'base64')) : Buffer.from(body.originalImage, 'base64');
        return await Jimp.read(buffer);
    }
}
