const sut = require('../mongo-helper')

const mockCollectionData = () => ({
    _id: 'any_id',
    name: 'any_name'
})

const mockCollectionListData = () => ([
    mockCollectionData(),
    mockCollectionData(),
    mockCollectionData(),
    mockCollectionData(),
    mockCollectionData()
])

describe('Mongodb Helper', () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL)
    })
    afterAll(async () => {
        await sut.disconnect()
    })

    it('Should connect successfully', async () => {
        await sut.disconnect()
        let client = sut.client
        expect(client).toBeFalsy()
        await sut.connect(sut.url)
        client = sut.client
        expect(client).toBeTruthy()
    })

    it('Should reconnect if mongodb down', async () => {
        let accountConnection = await sut.getCollection('accounts')
        expect(accountConnection).toBeTruthy()
        await sut.disconnect()
        accountConnection = await sut.getCollection('accounts')
        expect(accountConnection).toBeTruthy()
    })

    it('Should map a collection correctly', () => {
        const collection = sut.map(mockCollectionData())
        expect(collection.id).toBeTruthy()
    })

    it('Should map a collection list correctly', () => {
        const collectionList = sut.mapList(mockCollectionListData())
        expect(collectionList[2].id).toBeTruthy()
    })
})