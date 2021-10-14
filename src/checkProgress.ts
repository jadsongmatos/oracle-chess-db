export default function checkProgress(body: any): any {
    const cmpMoves = body.moves.slice(0, -1);
    if (body.progress.includes(cmpMoves)) {
        return true;
    }
    return false;
}
