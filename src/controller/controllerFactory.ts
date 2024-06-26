import { DataPreparationServiceConfig } from '../config';
import { IDataPreparationServiceConfig } from '../types/dataPreparerTypes';
import { DataPreparationServiceController } from './dataPreparerController';

export class ControllerFactory {
    static makeDataPreparationServiceController(config?: IDataPreparationServiceConfig): DataPreparationServiceController {
        return new DataPreparationServiceController(config || new DataPreparationServiceConfig());
    }
}
