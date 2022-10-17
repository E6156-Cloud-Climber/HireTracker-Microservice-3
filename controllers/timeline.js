const express = require('express')
const conn = require('../db_conn')

var api_timeline = express.Router()

api_timeline.use(express.json())

api_timeline.get('/users/:user_id/timelines', (req, res) => {
    let user_id = req.params.user_id

    let sql = `select * from (select * from posts where user_id = ${user_id}) user_posts
    inner join
        (select position_id, max(date) as max_date from posts
            where user_id = ${user_id} group by position_id) latest
    on user_posts.position_id = latest.position_id order by max_date desc, user_posts.position_id, date;`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else {
            let data = []
            rows.forEach((row) => {
                if (data.length == 0 || row.position_id != data[data.length - 1].position_id) {
                    data.push({ position_id: row.position_id, posts: [] })
                }
                delete row.user_id
                delete row.position_id
                delete row.max_date
                data[data.length - 1].posts.push(row)
            })
            res.json(data)
        }
    })
})

module.exports = api_timeline;