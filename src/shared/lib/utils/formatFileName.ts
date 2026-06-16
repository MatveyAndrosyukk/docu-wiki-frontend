export const formatFileName = (
    fileName: string,
    maxLength = 12
) => {
    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex === -1) {
        return fileName.length > maxLength
            ? `${fileName.slice(0, maxLength)}...`
            : fileName;
    }

    const name = fileName.slice(0, lastDotIndex);
    const extension = fileName.slice(lastDotIndex);

    if (fileName.length <= maxLength) {
        return fileName;
    }

    const availableLength =
        maxLength - extension.length - 3;

    return `${name.slice(0, availableLength)}...${extension}`;
};