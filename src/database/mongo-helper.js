const { MongoClient } = require('mongodb')

const MongoHelper = {
    client: null,
    url: null,
    async connect(url){
        this.url = url
        this.client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    },
    async disconnect(){
        await this.client.close()
        this.client = null
    },
    async getCollection(name) {
        if (this.client === null) {
            await this.connect(this.url)
        }
        return this.client.db().collection(name)
    },
    map(collection){
        const { _id, ...dataWithOutId } = collection
        return Object.assign({}, dataWithOutId, { id: _id })
    },
    mapList(collection){
        return collection.map(c => MongoHelper.map(c))
    }
}

module.exports = MongoHelper