import {ServerFile} from "../types/ServerFile";
import {UiFile} from "../types/UiFile";
import {mapServerFileToUi} from "./mapServerFileToUi";

export const mapServerFilesToUi = (files: ServerFile[]): UiFile[] =>
    files.map(mapServerFileToUi);