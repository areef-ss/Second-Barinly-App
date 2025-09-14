export function random(len) {
    let options = "cjchqjbcjbcjdvcmccjdvs,jdvsvddvvdvsdvqwertyuioasdfghjklkzxcvbnmcghjkdeerthnji";
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options.charAt(Math.floor(Math.random() * options.length));
    }
    return ans;
}
