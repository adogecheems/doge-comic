import fs from 'fs';
import isImg from '../tools/isImg';

async function traverseImages(root = '/userdisk/Favorite') {
    const result = [];
    await traverse(root, result);
    return result;
}

async function traverse(dir, result) {
    const nodes = await fs.readdir(dir, { withFileTypes: true });

    for (const node of nodes) {
        const path = `${dir}/${node.name}`;

        if (node.isDirectory()) {
            const files = await fs.readdir(path);
            const images = files.filter(isImg);

            if (files.length > 0 && images.length / files.length > 0.8) {
                result.push({
                    path: path,
                    type: 'folder'
                });
            } else {
                await traverse(path, result);
            }
        } else if (isImg(node.name)) {
            result.push({
                path: path,
                type: 'file'
            });
        }
    }
}

export default traverseImages;