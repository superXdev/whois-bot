import fs from 'fs';
import path from 'path';

/**
 * Returns complete message from view template
 * 
 * @param {string} rel 
 * @param {object} params 
 * @return {string} message
 */
export function view(rel, params) {
    const pathView = path.resolve(__dirname) + '/../views/' + rel + '.js';

    if(!fs.existsSync(pathView)) {
        throw new Error('View file does not exists!');
    }

    const message = require(pathView).default;

    const prop = Object.getOwnPropertyDescriptor(message, 'setData');
    if(prop) {
        if(typeof params !== 'object') {
            throw new Error('Params is not object!');
        }

        message.setData = params;
    }

    return message;
}