import { httpsUrl } from '../utils';
import axios, { HttpStatusCode } from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { COMPRESSIONTYPE, IMAGEDATATYPE } from '../../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import Jimp from 'jimp';
import { gzip } from 'node-gzip';

const axiosClient = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

describe('skeletonize request', () => {
    describe('GET /healthCheck', () => {
        it('should respond with 200', async () => {
            const response = await axiosClient.get(httpsUrl + '/healthCheck');
            expect(response.status).toBe(200);
            expect(response.data).toBe('i am healthy!!!');
        });
    });

    describe('POST /prepare', () => {
        const prepareDataUrl = httpsUrl + '/prepare';

        it('should response with 200 with calling prepare with plain image', async () => {
            const sampleImageUrl = './test/integration/data/zou_character.png';
            const data = await fs.readFile(sampleImageUrl);
            const arrayBuffer = Buffer.from(data).toString('base64');

            const response = await axiosClient.post(prepareDataUrl, {
                originalImage: arrayBuffer,
                originalImageType: IMAGEDATATYPE.PNG,
                inputCompression: COMPRESSIONTYPE.PLAIN,
                outputCompression: COMPRESSIONTYPE.PLAIN,
                outputType: IMAGEDATATYPE.PNG,
                outputHeight: 80,
                outputWidth: 80,
            });

            expect(response.status).toBe(HttpStatusCode.Ok);
            expect(response.data.length).toBeGreaterThan(0);
        });

    });
});
