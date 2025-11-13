export function convertToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds - minutes * 60).toFixed(0);
    return `${minutes}:${Number(secs) < 10 ? '0' + secs : secs}`
}