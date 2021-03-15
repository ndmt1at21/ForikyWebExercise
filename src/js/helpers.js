var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const timout = function (miliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (_, reject) {
            setTimeout(() => reject(new Error('Request take a lot of time, please try again')), miliseconds);
        });
    });
};
export const AJAX = function (link, postData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let reqPromise = postData
                ? fetch(link, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                : fetch(link, {
                    method: 'GET'
                });
            const res = yield Promise.race([reqPromise, timout(10000)]);
            // if success, it's respone
            // else throw Error timeout
            const response = res;
            if (!response.ok)
                throw new Error('Cannot get respone');
            const json = yield response.json();
            return json.data;
        }
        catch (error) {
            throw error;
        }
    });
};
