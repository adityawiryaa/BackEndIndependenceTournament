const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoConnect = require('./configs/server')
const routers = require('./routes/routes')

mongoConnect();
const app = express()
const port = 8000

app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json())
app.use(express.json());
app.use(routers)


app.listen(port, () => {
    console.log(`App run on http://localhost:${port}`)
})