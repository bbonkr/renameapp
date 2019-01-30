'use strict';

class FileInfo {
    constructor() {
        /**
         * 파일이름
         */
        this.name;
        /**
         * 확장자
         */
        this.extension;
        /**
         * 경로
         */
        this.directoryName;
        /**
         * 전체 경로
         */
        this.fullPath;
        /**
         * 오류
         */
        this.error = null;
        /**
         * 오류 여부
         */
        this.hasError = false;
        /**
         * 이름변경 여부
         */
        this.renamed = false;
    }
}

module.exports = FileInfo;
