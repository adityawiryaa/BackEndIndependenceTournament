const mongoose = require('mongoose')

module.exports = () => {
    const finalServer = `mongodb://localhost/IndependenceTournament`
    mongoose.connect( process.env.MONGODB_URI || finalServer,{
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    const db = mongoose.connection
    db.once('open',() => {
        console.log('connect mongoose on ', finalServer);
    })
}