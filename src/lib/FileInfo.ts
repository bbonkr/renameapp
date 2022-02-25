import path, { normalize } from 'path';
import fs from 'fs';
import { FileInfoModel } from '../models';

export class FileInfo implements FileInfoModel {
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

    public static fromPath(fileOrDirectoryPaths: string[]): FileInfo[] {
        const files: FileInfo[] = [];

        fileOrDirectoryPaths.forEach(fileOrDirectoryPath => {
            const stats = fs.lstatSync(fileOrDirectoryPath);

            if (stats.isDirectory()) {
                // directory
                const subPaths = fs.readdirSync(fileOrDirectoryPath);

                subPaths.forEach(p => {
                    const subPath = path.join(fileOrDirectoryPath, p);
                    console.info('subPaths', subPath);

                    const subStats = fs.lstatSync(subPath);

                    if (subStats.isDirectory()) {
                        const subItems = FileInfo.fromPath([subPath]);
                        files.splice(0, 0, ...subItems);
                    } else {
                        // file
                        try {
                            fs.accessSync(
                                subPath,
                                fs.constants.R_OK | fs.constants.W_OK,
                            );

                            files.splice(0, 0, FileInfo.fromFilePath(subPath));
                        } catch (err) {
                            console.warn(
                                `Cannot access file or directory. ${normalize(
                                    subPath,
                                )}`,
                            );
                        }
                    }
                });
            } else {
                // file
                try {
                    files.splice(
                        0,
                        0,
                        FileInfo.fromFilePath(fileOrDirectoryPath),
                    );
                } catch (err) {
                    console.warn(
                        `Cannot access file or directory. ${normalize(
                            fileOrDirectoryPath,
                        )}`,
                    );
                }
            }
        });

        return files;
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

    constructor(value?: FileInfoModel) {
        if (value) {
            this.name = value.name;
            this.directoryName = value.directoryName;
            this.extension = value.extension;
            this.fullPath = value.fullPath;
            this.renamed = value.renamed || false;
            this.error = value.error;
        }
    }
}
