export default function fileSort(a, b) {
    const aMatch = a.name.match(/(\d+)/);
    const bMatch = b.name.match(/(\d+)/);
    const aNum = aMatch ? parseInt(aMatch[1], 10) : 0;
    const bNum = bMatch ? parseInt(bMatch[1], 10) : 0;
    if (aNum !== bNum) {
        return aNum - bNum;
    }
    return a.name.localeCompare(b.name);
}