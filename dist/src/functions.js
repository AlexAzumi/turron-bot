"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSample = void 0;
/**
 * Gets the string of user samples
 * @param users - sample of users online in the server
 * @param  size - Amount of samples that will be shown
 */
const getUserSample = (users, size) => {
    if (!users || !users.length) {
        return 'None';
    }
    let samplesInText = '';
    const sampleToUse = users.slice(0, size);
    sampleToUse.forEach((user) => {
        if (!samplesInText) {
            samplesInText = user.name;
        }
        else {
            samplesInText += `, ${user.name}`;
        }
    });
    return samplesInText;
};
exports.getUserSample = getUserSample;
//# sourceMappingURL=functions.js.map