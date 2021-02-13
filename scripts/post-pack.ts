import fs from 'fs';
import glob from 'glob';

const cleanUp = () => {
    glob('packages/!(*.exe|*.dmg)', (err, matches) => {
        if (err) {
            console.error(err);
        } else {
            if (matches.length > 0) {
                matches.forEach(item => {
                    fs.rmSync(item, { recursive: true });

                    // console.info(`${index + 1}: ${item}`);
                });

                console.info('"Clean Artifacts Task" done.');
            } else {
                console.info('Nothing to clean.');
            }
        }
    });
};

cleanUp();

export default {};
