import { httpsUrl } from '../utils';
import axios, { HttpStatusCode } from 'axios';
import https from 'https';
import fs from 'fs/promises';
import { COMPRESSIONTYPE, IMAGEDATATYPE } from '../../../Chisel-Global-Common-Libraries/src/types/commonTypes';
import {PreparedData} from '../../../src/types/dataPreparerTypes';
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
            expect(response.data.length).toEqual(19);

            for(let i = 0; i < response.data.length; i++) {
                const responseData: PreparedData = response.data[4];
                const buffer = Buffer.from(responseData.preparedData, 'base64');
                const image = await Jimp.read(buffer);
                expect(Jimp.intToRGBA(image.getPixelColor(0, 0))).toEqual({r: 255, g: 255, b: 255, a:255});
                await image.writeAsync(`./test/integration/data/zou_charactrer_prepared_${i}_test.png`);
            }
        });
    });
});
