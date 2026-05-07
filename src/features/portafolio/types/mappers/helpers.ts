export const safeArray = <T>(value: any): T[] => {
    return Array.isArray(value) ? value : [];
};