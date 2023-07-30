export default {
    set setData(data) {
        this.data = data;
    },
    get stats() {
        return `Registered on: ${new Date(this.data.registered).toLocaleDateString()}
Language: ${this.data.lang}

*All stats*
Total user: ${this.data.totalUser}`
    }
}