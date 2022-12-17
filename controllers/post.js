const express = require('express')
const conn = require('../db_conn')

var api_post = express.Router()

api_post.use(express.json())

api_post.get('/users/:user_id/posts', (req, res) => {
    let user_id = req.params.user_id
    let company_id = req.query.company_id ?? ''
    let position_id = req.query.position_id ?? ''
    let page = Number(req.query.page ?? 1)
    let limit = Number(req.query.limit ?? 25)

    let sql = `select * from posts where user_id = ${user_id}`
    if (position_id) sql += ` and position_id = ${position_id}`
    // else if (company_id) sql += ` and company_id = ${company_id}`
    sql += ` order by id desc`
    sql += ` limit ${limit} offset ${limit * (page - 1)}`

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ error: err })
            return
        }

        rows.forEach((post) => {
            post.links = {
                phase: `/phases/${post.phase_id}`,
                user: `/users/${post.user_id}`,
                position: `/positions/${post.position_id}`
            }
        });
        // total count
        let sql_total = `select count(*) as total from posts where user_id = ${user_id}`
        if (position_id) sql_total += ` and position_id = ${position_id}`
        // else if (company_id) sql += ` and company_id = ${company_id}`
        conn.query(sql_total, (err1, totals, fields) => {
            if (err1) {
                res.status(500).json({ error: err1 })
                return
            }

            let total = totals[0].total
            res.json({
                posts: rows,
                total: total,
                links: {
                    next: page * limit < total ? `/users/${user_id}/posts?company_id=${company_id}&position_id=${position_id}&page=${page + 1}&limit=${limit}` : '',
                    prev: page > 1 ? `/users/${user_id}/posts?company_id=${company_id}&position_id=${position_id}&page=${page - 1}&limit=${limit}` : ''
                }
            })
        })
    })
})

api_post.post('/users/:user_id/posts', (req, res) => {
    let user_id = req.params.user_id

    let phase_id = req.body.phase_id
    let position_id = req.body.position_id
    let date = req.body.date
    let description = req.body.description ?? ""

    let sql = `insert into posts (phase_id, user_id, position_id, date, description)
    values (${phase_id}, ${user_id}, ${position_id}, "${date}", "${description}")`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json({ post_id: rows.insertId })
    })
})

api_post.get('/posts', (req, res) => {
    let company_id = req.query.company_id ?? ''
    let position_id = req.query.position_id ?? ''
    let page = Number(req.query.page ?? 1)
    let limit = Number(req.query.limit ?? 25)

    let sql = `select * from posts`
    if (position_id) sql += ` where position_id = ${position_id}`
    // else if (company_id) sql += ` and company_id = ${company_id}`
    sql += ` order by id desc`
    sql += ` limit ${limit} offset ${limit * (page - 1)}`

    conn.query(sql, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ error: err })
            return
        }

        rows.forEach((post) => {
            post.links = {
                phase: `/phases/${post.phase_id}`,
                user: `/users/${post.user_id}`,
                position: `/positions/${post.position_id}`
            }
        });
        // total count
        let sql_total = `select count(*) as total from posts`
        if (position_id) sql_total += ` where position_id = ${position_id}`
        // else if (company_id) sql += ` and company_id = ${company_id}`
        conn.query(sql_total, (err1, totals, fields) => {
            if (err1) {
                res.status(500).json({ error: err1 })
                return
            }

            let total = totals[0].total
            res.json({
                posts: rows,
                total: total,
                links: {
                    next: page * limit < total ? `/posts?company_id=${company_id}&position_id=${position_id}&page=${page + 1}&limit=${limit}` : '',
                    prev: page > 1 ? `/posts?company_id=${company_id}&position_id=${position_id}&page=${page - 1}&limit=${limit}` : ''
                }
            })
        })
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
        else {
            let post = rows[0]
            post.links = {
                phase: `/phases/${post.phase_id}`,
                user: `/users/${post.user_id}`,
                position: `/positions/${post.position_id}`
            }
            res.json(post)
        }
    })
})


api_post.put('/posts/:post_id', (req, res) => {
    let post_id = req.params.post_id

    let phase_id = req.body.phase_id
    let position_id = req.body.position_id
    let date = req.body.date
    let description = req.body.description ?? ""

    let sql = `update posts set phase_id=${phase_id}, position_id=${position_id}, 
    date="${date}", description="${description}" where id=${post_id}`

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