module.exports = {
  mongoURI: process.env.NODE_ENV === 'production' ? 'mongodb://wish-cards_mongo_1:27017/wish-cards' : 'mongodb://localhost:27017/wish-cards',
  apiEndpoint: process.env.NODE_ENV === 'production' ? 'http://wish-cards_server_1:4000' : 'http://localhost:4000'
}
