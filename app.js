const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');


app.use(cors({
    origin: '*'
}));

app.use('/api', require('./controllers/phase'));
app.use('/api', require('./controllers/post'));
app.use('/api', require('./controllers/timeline'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})