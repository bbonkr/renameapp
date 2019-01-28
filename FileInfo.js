'use strict';
const path = require('path');

class FileInfo {
    constructor() {
        this.name;
        this.extension;
        this.directoryName;
        this.fullPath;
        this.error = null;
        this.hasError = false;
        this.renamed = false;
    }
}

module.exports = FileInfo;
