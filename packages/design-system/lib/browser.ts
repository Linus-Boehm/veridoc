import {UAParser} from 'ua-parser-js';

const uaParser = new UAParser();
const ua = uaParser.getResult();

export const isMac = () => ua.os.name === 'Mac OS';
