export const uppercase_first = (string: string) => string[0].toUpperCase() + string.substring(1);

export const to_camel_case = (str: string) => {
    let s = to_pascal_case(str);
    return s[0].toLowerCase() + s.substring(1);
}

export const to_pascal_case = (str: string) => {
    let r = "";
    let capitalize = true;
    let is_all_uppercase = str.toUpperCase() == str;

    for (let c of str) {
        if (c == '_') {
            capitalize = true;
        } else if (capitalize) {
            r += c.toUpperCase();
            capitalize = false;
        } else {
            r += is_all_uppercase ? c.toLowerCase() : c;
        }
    }
    return r;
}

export const to_snake_case = (str: string) => {
    let r = "";
    let is_all_uppercase = str.toUpperCase() == str;
    for (let i=0;i<str.length;i++) {
        if (i > 0 && str[i].toUpperCase() == str[i] && !is_all_uppercase) {
            r += '_';
        }
        r += str[i].toLowerCase();
    }
    return r;
}
