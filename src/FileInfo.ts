import path from 'path';

export interface IFileInfo {
    /** 파일이름 */
    name: string;

    /** 확장자 */
    extension: string;

    /**  경로 */
    directoryName: string;

    /** 전체 경로 */
    fullPath: string;

    /**  오류 */
    error?: any;

    /** 이름변경 여부 */
    renamed: boolean;
}

export class FileInfo implements IFileInfo {
    public static fromFilePath(filePath: string): FileInfo {
        const extension = path.extname(filePath);
        const name = path.basename(filePath, extension).normalize();
        const directoryName = path.dirname(filePath);

        const obj = new FileInfo({
            name: name,
            extension: extension,
            directoryName: directoryName,
            fullPath: filePath,
            error: null,
            renamed: false,
        });

        return obj;
    }

    /** 파일이름 */
    public name!: string;
    /** 확장자 */
    public extension!: string;

    /**  경로 */
    public directoryName!: string;
    /** 전체 경로 */
    public fullPath!: string;
    /** 오류 */
    public error?: any;

    /**  이름변경 여부 */
    public renamed!: boolean;

    constructor(value?: IFileInfo) {
        if (value) {
            this.name = value.name;
            this.directoryName = value.name;
            this.extension = value.extension;
            this.fullPath = value.fullPath;
            this.renamed = value.renamed || false;
            this.error = value.error;
        }
    }

    public hasError(): boolean {
        return this.error;
    }
}
