import { BoundingRect, DataPreparationRequestBody, IDataPreparationServiceConfig, PreparedData } from '../types/dataPreparerTypes';
import { COMPRESSIONTYPE, IMAGEDATATYPE } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import { gzip, ungzip } from 'node-gzip';
import Jimp from 'jimp';
import { DataPreparationServiceConfig } from '../config';

export class DataPreparerModel {
    private config: IDataPreparationServiceConfig;

    constructor(config?: IDataPreparationServiceConfig) {
        this.config = config || new DataPreparationServiceConfig();
    }

    public async prepare(body: DataPreparationRequestBody): Promise<PreparedData[]> {
        if (body.originalImageType !== IMAGEDATATYPE.PNG) {
            throw new Error('image type other than PNG is not supported for now');
        }

        const jimp = await this.getJimpImage(body);
        const images = await this.parseImageIntoIndividualItems(jimp);

        const preparedData: PreparedData[] = [];
        for (let i = 0; i < images.length; i++) {
            const boundingRect = this.findBoundingRect(images[i]);

            const resizedImage = this.resizeImage(images[i], boundingRect, body.outputHeight, body.outputWidth);
            const blurredImage = resizedImage.blur(3).grayscale().contrast(0.8);

            preparedData.push({
                preparedDataType: body.outputType,
                preparedDataCompression: body.outputCompression,
                preparedData: body.outputCompression === COMPRESSIONTYPE.GZIP ? Buffer.from(await gzip(await blurredImage.getBufferAsync(Jimp.MIME_PNG))).toString('base64') : Buffer.from(await blurredImage.getBufferAsync(Jimp.MIME_PNG)).toString('base64'),
                preparedDataDescription: [],
                preparedDataHeight: body.outputHeight,
                preparedDataWidth: body.outputWidth,
                originalBoundingRect: boundingRect, // topleft is the offset from original image
            });

            const mirrorImage = blurredImage.flip(true, false);

            preparedData.push({
                preparedDataType: body.outputType,
                preparedDataCompression: body.outputCompression,
                preparedData: body.outputCompression === COMPRESSIONTYPE.GZIP ? Buffer.from(await gzip(await mirrorImage.getBufferAsync(Jimp.MIME_PNG))).toString('base64') : Buffer.from(await mirrorImage.getBufferAsync(Jimp.MIME_PNG)).toString('base64'),
                preparedDataDescription: [],
                preparedDataHeight: body.outputHeight,
                preparedDataWidth: body.outputWidth,
                originalBoundingRect: boundingRect, // topleft is the offset from original image
            });
        }

        return preparedData;
    }

    private resizeImage(inputJimp: Jimp, boundingRect: BoundingRect, outputHeight: number, outputWidth: number): Jimp {
        let top = boundingRect.topleft.r;
        let left = boundingRect.topleft.c;
        let bottom = boundingRect.bottomRight.r;
        let right = boundingRect.bottomRight.c;

        inputJimp.crop(left, top, right - left, bottom - top).resize(outputWidth - 2, outputHeight - 2);
        const imageWithWhiteBorder = new Jimp(outputWidth, outputHeight, 'white').blit(inputJimp, 1, 1);
        return imageWithWhiteBorder;
    }

    private async parseImageIntoIndividualItems(jimp: Jimp): Promise<Jimp[]> {
        // not implemented
        return [jimp];
    }

    private findBoundingRect(jimp: Jimp): BoundingRect {
        // note this is only for testing / prototyping
        let top = Number.MAX_VALUE;
        let bottom = Number.MIN_VALUE;
        let right = Number.MIN_VALUE;
        let left = Number.MAX_VALUE;

        for (let i = 0; i < jimp.getHeight(); i++) {
            for (let j = 0; j < jimp.getWidth(); j++) {
                const rgba = Jimp.intToRGBA(jimp.getPixelColor(j, i));
                if ((rgba.r + rgba.g + rgba.b) / 3 <= this.config.grayScaleWhiteThreshold) {
                    top = Math.min(i, top);
                    bottom = Math.max(i, bottom);
                    left = Math.min(j, left);
                    right = Math.max(j, right);
                }
            }
        }

        return { topleft: { r: top, c: left }, bottomRight: { r: bottom, c: right } };
    }

    private async getJimpImage(body: DataPreparationRequestBody): Promise<Jimp> {
        const buffer = body.inputCompression === COMPRESSIONTYPE.GZIP ? await ungzip(Buffer.from(body.originalImage, 'base64')) : Buffer.from(body.originalImage, 'base64');
        return await Jimp.read(buffer);
    }
}
