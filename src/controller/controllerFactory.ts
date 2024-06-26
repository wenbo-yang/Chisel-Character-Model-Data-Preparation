import { ImagePreprocessingServiceConfig } from '../config';
import { IImagePreprocessingServiceConfig } from '../types/imagePreprocessorTypes';
import { ImagePreprocessingServiceController } from './imagePreprocessorController';

export class ControllerFactory {
    static makeImagePreprocessingServiceController(config?: IImagePreprocessingServiceConfig): ImagePreprocessingServiceController {
        return new ImagePreprocessingServiceController(config || new ImagePreprocessingServiceConfig());
    }
}
