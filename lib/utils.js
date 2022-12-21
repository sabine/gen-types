"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.to_snake_case = exports.to_pascal_case = exports.to_camel_case = exports.uppercase_first = void 0;
const uppercase_first = (string) => string[0].toUpperCase() + string.substring(1);
exports.uppercase_first = uppercase_first;
const to_camel_case = (str) => {
    let s = (0, exports.to_pascal_case)(str);
    return s[0].toLowerCase() + s.substring(1);
};
exports.to_camel_case = to_camel_case;
const to_pascal_case = (str) => {
    let r = "";
    let capitalize = true;
    let is_all_uppercase = str.toUpperCase() == str;
    for (let c of str) {
        if (c == '_') {
            capitalize = true;
        }
        else if (capitalize) {
            r += c.toUpperCase();
            capitalize = false;
        }
        else {
            r += is_all_uppercase ? c.toLowerCase() : c;
        }
    }
    return r;
};
exports.to_pascal_case = to_pascal_case;
const to_snake_case = (str) => {
    let r = "";
    let is_all_uppercase = str.toUpperCase() == str;
    for (let i = 0; i < str.length; i++) {
        if (i > 0 && str[i].toUpperCase() == str[i] && !is_all_uppercase) {
            r += '_';
        }
        r += str[i].toLowerCase();
    }
    return r;
};
exports.to_snake_case = to_snake_case;
