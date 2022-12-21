export const snakeToCamel = (str: string) =>
str.replace(/([-_][a-z])/g, community => //.toLowerCase()
    community
        .toUpperCase()
        .replace('-', '')
        .replace('_', '')
);

export const uppercaseFirst = (string: string) => string[0].toUpperCase() + string.substring(1);
