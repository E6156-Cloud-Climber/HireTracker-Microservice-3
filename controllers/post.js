const express = require('express')
const conn = require('../db_conn')

var api_post = express.Router()

api_post.use(express.json())

api_post.get('/users/:user_id/posts', (req, res) => {
    let user_id = req.params.user_id
    let company_id = req.query.company_id ?? 0
    let position_id = req.query.position_id ?? 0
    let offset = req.query.offset ?? 0
    let limit = req.query.limit ?? 25

    let sql = `select * from posts where user_id = ${user_id}`
    if (position_id) sql += ` and position_id = ${position_id}`
    // else if (company_id) sql += ` and company_id = ${company_id}`
    sql += ` order by id desc`
    sql += ` limit ${limit} offset ${offset}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json(rows)
    })
})

api_post.post('/users/:user_id/posts', (req, res) => {
    let user_id = req.params.user_id

    let phase_id = req.body.phase_id
    let position_id = req.body.position_id
    let date = req.body.date
    let desc = req.body.desc ?? ""

    let sql = `insert into posts (phase_id, user_id, position_id, date, description)
    values (${phase_id}, ${user_id}, ${position_id}, "${date}", "${desc}")`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json({ post_id: rows.insertId })
    })
})

api_post.get('/posts', (req, res) => {
    let company_id = req.query.company_id ?? 0
    let position_id = req.query.position_id ?? 0
    let offset = req.query.offset ?? 0
    let limit = req.query.limit ?? 25

    let sql = `select * from posts`
    if (position_id) sql += ` where position_id = ${position_id}`
    // else if (company_id) sql += ` and company_id = ${company_id}`
    sql += ` order by id desc`
    sql += ` limit ${limit} offset ${offset}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json(rows)
    })
})

api_post.get('/posts/:post_id', (req, res) => {
    let post_id = req.params.post_id

    let sql = `select * from posts where id = ${post_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else if (rows.length == 0)
            res.status(400).json({ error: "id not exist" })
        else
            res.json(rows[0])
    })
})


api_post.put('/posts/:post_id', (req, res) => {
    let post_id = req.params.post_id

    let phase_id = req.body.phase_id
    let position_id = req.body.position_id
    let date = req.body.date
    let desc = req.body.desc ?? ""

    let sql = `update posts set phase_id=${phase_id}, position_id=${position_id}, 
    date="${date}", description="${desc}" where id=${post_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json()
    })
})

api_post.delete('/posts/:post_id', (req, res) => {
    let post_id = req.params.post_id

    let sql = `delete from posts where id=${post_id}`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json()
    })
})

module.exports = api_post;