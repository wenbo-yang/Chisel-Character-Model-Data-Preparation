import * as staticServiceConfig from '../configs/service.config.json';
import * as globalServicePortMappings from '../Chisel-Global-Service-Configs/configs/globalServicePortMappings.json';
import { IDataPreparationServiceConfig } from './types/dataPreparerTypes';
import { IServiceConfig, IServicePorts } from '../Chisel-Global-Common-Libraries/src/types/commonTypes';

export class DataPreparationServiceConfig implements IDataPreparationServiceConfig {
    private serviceConfig: IServiceConfig;
    private globalServicePortMappings: any;

    constructor(serviceConfig?: IServiceConfig, parsedGlobalServicePortMappings?: any) {
        this.serviceConfig = serviceConfig || staticServiceConfig;
        this.globalServicePortMappings = parsedGlobalServicePortMappings || globalServicePortMappings;
    }

    public get grayScaleWhiteThreshold() {
        return 250;
    }

    public get shortName() {
        return this.serviceConfig.shortName;
    }

    public get useGPU() {
        return false;
    }

    public get env() {
        return process.env.NODE_ENV || 'development';
    }

    public get servicePorts(): IServicePorts {
        return this.globalServicePortMappings.hasOwnProperty(this.serviceConfig.serviceName) && this.globalServicePortMappings[this.serviceConfig.serviceName].hasOwnProperty(this.env) ? this.globalServicePortMappings[this.serviceConfig.serviceName][this.env] : { http: 5000, https: 3000 };
    }
}
