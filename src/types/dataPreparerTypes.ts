import Jimp from 'jimp';
import { BoundingRect, COMPRESSIONTYPE, IMAGEDATATYPE, IServicePorts, Point } from '../../Chisel-Global-Common-Libraries/src/types/commonTypes';

export interface IDataPreparationServiceConfig {
    grayScaleWhiteThreshold: number;
    shortName: string;
    useGPU: boolean;
    env: string;
    servicePorts: IServicePorts;
}

export interface DataPreparationRequestBody {
    originalImage: string;
    originalImageType: IMAGEDATATYPE;
    inputCompression: COMPRESSIONTYPE;
    outputCompression: COMPRESSIONTYPE;
    outputType: IMAGEDATATYPE;
    outputHeight: number;
    outputWidth: number;
}

export interface ISkeletonizerClient {
    skeletonize(image: Jimp, outputHeight: number, outputWidth: number): Promise<Jimp>;
}

export interface DataPreparationResponseBody {
    preparedData: PreparedData[];
}

export enum DATAPREPARATIONMETHODS {
    SKELETON = 'SKELETON',
    PERIMETER = 'PERIMETER',
    BOLDSTROKE = 'BOLDSTROKE',
    TILTED = 'TILTED',
    ORIGINAL = 'ORIGINAL',
    OTHER = 'OTHER',
}

export interface PreparedDataDesciption {
    description: DATAPREPARATIONMETHODS;
    otherDescription?: string;
}

export interface PreparedData {
    preparedDataType: IMAGEDATATYPE;
    preparedDataCompression: COMPRESSIONTYPE;
    preparedData: string;
    preparedDataDescription: PreparedDataDesciption[];
    preparedDataHeight: number;
    preparedDataWidth: number;
    originalBoundingRect: BoundingRect; // topleft is the offset from original image
}
