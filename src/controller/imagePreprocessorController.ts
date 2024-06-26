import { ImagePreprocessorModel } from '../model/imagePreprocessorModel';
import { ImagePreprocessingServiceConfig } from '../config';
import { IImagePreprocessingServiceConfig, ImagePreprocessRequestBody, ProcessedImage } from '../types/imagePreprocessorTypes';
import { Request, Response } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { DoNotRespondError } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';

export class ImagePreprocessingServiceController {
    private imagePreprocessorModel: ImagePreprocessorModel;
    private config: IImagePreprocessingServiceConfig;

    constructor(config?: IImagePreprocessingServiceConfig, imagePreprocessorModel?: ImagePreprocessorModel) {
        this.config = config || new ImagePreprocessingServiceConfig();
        this.imagePreprocessorModel = imagePreprocessorModel || new ImagePreprocessorModel(this.config);
    }

    public async process(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<ProcessedImage[]> {
        const body = req.body as ImagePreprocessRequestBody;
        return await this.imagePreprocessorModel.processImage(body);
    }
}
