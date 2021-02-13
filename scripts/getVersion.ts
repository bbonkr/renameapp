export const getVersion = (): number => {
    const matches = process.version.match(/^v(\d+\.\d+)/);
    if (matches && matches.length > 1) {
        return parseFloat(matches[1]);
    } else {
        return 12;
    }
};
