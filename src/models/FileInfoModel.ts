export interface FileInfoModel {
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
