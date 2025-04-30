function sumOfNNumber(n) {
    if (n==1) {
        return n;
    } else {
        return n + sumOfNNumber(n-1)
    }
}
console.log(sumOfNNumber(4 ));