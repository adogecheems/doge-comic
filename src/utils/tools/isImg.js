export default function isImg(filename) {
    const ext = filename.split('.').pop().toUpperCase();
    return ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP'].includes(ext);
}