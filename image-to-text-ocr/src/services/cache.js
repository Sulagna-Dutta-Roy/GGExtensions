export class LruCacheLinear {
    constructor(size) {
        this.size = size
        this.map = {}
        this.len = 0
    }
    get(key) {
        const data = this.map[key]
        if(data){
            this.map[key].count++
            return data.value
        }
        return null
    }
    leastRecentlyUsed() {
       const keys = Object.keys(this.map)
       let min = this.map[keys[0]]
       for (let i = 0; i < keys.length; i++) {
         if(min.count > this.map[keys[i]].count) {
             min = this.map[keys[i]]
         }
       }
       return min
    }
    set(key, data) {
        this.map[key] = {
            key: key,
            value: data,
            count: 1
        }
        this.len++

        if(this.len > this.size) {
            const min = this.leastRecentlyUsed()
            delete this.map[min.key]
            this.len--
        }
    }
    clear() {
      this.map = {}
      this.len = 0
    }
}
