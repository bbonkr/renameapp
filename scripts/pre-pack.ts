import fs from 'fs';
import glob from 'glob';
import { getVersion } from './getVersion';

const cleanUp = () => {
    const version = getVersion();

    glob('*(packages|dist)', (err, matches) => {
        if (err) {
            console.error(err);
        } else {
            if (matches.length > 0) {
                matches.forEach(item => {
                    if (fs.existsSync(item)) {
                        if (version >= 14) {
                            fs.rmSync(item, { recursive: true });
                        } else {
                            if (fs.lstatSync(item).isDirectory()) {
                                fs.rmdirSync(item, { recursive: true });
                            } else if (fs.lstatSync(item).isFile()) {
                                fs.unlinkSync(item);
                            }

                            // console.info(`${index + 1}: ${item}`);
                        }
                    }
                });

                console.info('"Clean dist and packages Task" done.');
            } else {
                console.info('Nothing to clean.');
            }
        }
    });
};

cleanUp();

export default {};
