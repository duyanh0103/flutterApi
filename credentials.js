const collection_name = 'flutterApi'
module.exports = {
    cookieSecret: '123321',
    mongo: {
        development: {
            connectionString: `mongodb+srv://extrapoint:extrapoint@cluster0.dkzos.mongodb.net/${collection_name}`
        },
        production: {
            connectionString: `mongodb+srv://extrapoint:extrapoint@cluster0.dkzos.mongodb.net/${collection_name}?retryWrites=true&w=majority`
        }
    }
}