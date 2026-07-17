import {ReactComponent as BoldImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/bold.svg";
import {ReactComponent as ItalicImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/italic.svg";
import {ReactComponent as UnderlinedImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/underlined.svg";
import {ReactComponent as TerminalImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/terminal.svg";
import {ReactComponent as CodeImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/code.svg";
import {ReactComponent as CodeLineImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/code-line.svg";
import {ReactComponent as PointImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/point.svg";
import {ReactComponent as LineImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/line.svg";
import {ReactComponent as LinkImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/link.svg";
import {ReactComponent as ImgImage} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/image.svg";
import {ReactComponent as NumberList} from "../../../pages/main-page/components/opened-file/components/edit-mode/images/number-list.svg";


export const createEditorToolbar = (
    wrapSelection: (start: string, end: string) => void,
    pasteTag: (tag: string) => void,
    handleOpenFileDialog: () => void
) => [
    {
        title: 'Bold',
        icon: BoldImage,
        action: () => wrapSelection('[B] ', ' [/B]'),
        style: {width: '10.45px', height: '12.57px'}
    },
    {
        title: 'Italic',
        icon: ItalicImage,
        action: () => wrapSelection('[I] ', ' [/I]'),
        style: {width: '9px', height: '10.83px'}
    },
    {
        title: 'Underlined',
        icon: UnderlinedImage,
        action: () => wrapSelection('[U] ', ' [/U]'),
        style: {width: '10.45px', height: '12.57px'}
    },
    {
        title: 'Point',
        icon: PointImage,
        action: () => wrapSelection('[P]\n\n', '\n\n[/P]'),
        style: {width: '4px', height: '4px'}
    },
    {
        title: 'Numbers',
        icon: NumberList,
        action: () => wrapSelection('[NL]\n\n[N]', '[/N]\n\n[/NL]'),
        style: {width: '14px', height: '14px'}
    },
    {
        title: 'Link',
        icon: LinkImage,
        action: () => wrapSelection('[L to="https://example.com"] ', ' [/L]'),
        style: {width: '14px', height: '14px'}
    },
    {
        title: 'Code',
        icon: CodeImage,
        action: () => wrapSelection('[C name=""]\n\n', '\n\n[/C]'),
        style: {width: '16.32px', height: '14.57px'}
    },
    {
        title: 'Code line',
        icon: CodeLineImage,
        action: () => wrapSelection('[LC] ', ' [/LC]'),
        style: {width: '16px', height: '16px'}
    },
    {
        title: 'Terminal',
        icon: TerminalImage,
        action: () => wrapSelection('[T]\n\n', '\n\n[/T]'),
        style: {width: '14.25px', height: '12.67px'}
    },
    {
        title: 'Line',
        icon: LineImage,
        action: () => pasteTag('[L]'),
        style: {width: '14.25px', height: '1.81px'}
    },
    {
        title: 'Image',
        icon: ImgImage,
        action: handleOpenFileDialog
    }
];