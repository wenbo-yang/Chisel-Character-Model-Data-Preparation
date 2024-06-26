import { DataPreparerModel } from '../model/dataPreparerModel';
import { DataPreparationServiceConfig } from '../config';
import { DataPreparationRequestBody, IDataPreparationServiceConfig, PreparedData } from '../types/dataPreparerTypes';
import { Request } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export class DataPreparationServiceController {
    private dataPreparerModel: DataPreparerModel;
    private config: IDataPreparationServiceConfig;

    constructor(config?: IDataPreparationServiceConfig, dataPreparerModel?: DataPreparerModel) {
        this.config = config || new DataPreparationServiceConfig();
        this.dataPreparerModel = dataPreparerModel || new DataPreparerModel(this.config);
    }

    public async process(req: Request<{}, any, any, ParsedQs, Record<string, any>>): Promise<PreparedData[]> {
        const body = req.body as DataPreparationRequestBody;
        return await this.dataPreparerModel.prepare(body);
    }
}
