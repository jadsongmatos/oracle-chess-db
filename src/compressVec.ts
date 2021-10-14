export default function compressVec(vec: any) {

    let result = "";

    for (let i = 0; i < vec.length; i++) {
        // parseInt("1"+String("0000000" + vec[i].toString(2)).slice(-7), 2) == vec[i] + 128 ?
        result = result + String.fromCharCode(vec[i] + 32);
    }
    return result;
}