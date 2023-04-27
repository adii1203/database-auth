const mongooes = require('mongoose')

const { MONGODB_URL } = process.env

exports.connect = () => {
    mongooes.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('db connected');
    })
    .catch((error) => {
        console.log('DB not CONNECTED');
        console.log(error);
        process.exit(1)
    })
}