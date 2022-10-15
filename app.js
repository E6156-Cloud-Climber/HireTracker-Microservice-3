const express = require('express')
const app = express()
const port = 3000

app.use('/api', require('./controllers/phase'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})