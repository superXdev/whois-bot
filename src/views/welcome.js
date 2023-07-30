export default {
    set setData(data) {
        this.data = data;
    },
    get welcome() {
        return `Welcome ${this.data.nickname}`;
    }
}