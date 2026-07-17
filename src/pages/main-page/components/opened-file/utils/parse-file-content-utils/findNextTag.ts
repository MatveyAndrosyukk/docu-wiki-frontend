const imageRegex = /\[image\/(.+?)]/g;
const linkRegex = /\[L to="([^"]+)"](.+?)\[\/L]/g;
const simpleTagsRegex = /\[([UBI])\]([\s\S]+?)\[\/\1\]/g;
const lineCodeRegex = /\[LC](.*?)\[\/LC]/g;
const numberRegex = /\[N]([\s\S]+?)\[\/N]/g;

export default function findNextTag(
    text: string,
    startPos: number
) {
    imageRegex.lastIndex = startPos;
    linkRegex.lastIndex = startPos;
    simpleTagsRegex.lastIndex = startPos;
    lineCodeRegex.lastIndex = startPos;
    numberRegex.lastIndex = startPos;

    const imageMatch = imageRegex.exec(text);
    const linkMatch = linkRegex.exec(text);
    const simpleMatch = simpleTagsRegex.exec(text);
    const lineCodeMatch = lineCodeRegex.exec(text);
    const numberMatch = numberRegex.exec(text);

    const matches = [
        imageMatch && { type: 'image', match: imageMatch },
        linkMatch && { type: 'link', match: linkMatch },
        simpleMatch && { type: 'simple', match: simpleMatch },
        lineCodeMatch && { type: 'lineCode', match: lineCodeMatch },
        numberMatch && { type: 'number', match: numberMatch },
    ].filter(Boolean) as {
        type: string;
        match: RegExpExecArray;
    }[];

    if (!matches.length) {
        return null;
    }

    matches.sort(
        (a, b) => a.match.index - b.match.index
    );

    return matches[0];
}