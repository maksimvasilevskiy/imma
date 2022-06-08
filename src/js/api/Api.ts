const isProd: boolean = false;

export const BASE_URL: string = isProd ? 'https://api.imma.love' : 'https://api.imma.club';
export const BASE_URL_LOCAL: string = 'http://localhost:3000'; // http://localhost:3002

export const BLOCKCHAIN: 'ethereum' | 'polygon' = 'ethereum';

export const NETWORK_NAME: string = 'rinkeby';

export const NETWORK_ID: number = 4;

export const ORIGIN: string = 'imma_postman';
