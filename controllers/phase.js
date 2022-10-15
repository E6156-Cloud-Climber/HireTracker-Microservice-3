const express = require('express')
const conn = require('../db_conn')

var api_phase = express.Router()

api_phase.use(express.json())

api_phase.get('/phases', (req, res) => {
    let search_key = req.query.search_key ?? ""

    conn.query(`select * from phases where name like '%${search_key}%'`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json(rows)
    })
})

api_phase.post('/phases', (req, res) => {
    let name = req.body.name

    if (!name) return res.status(400).json({ error: "name must be non-empty" })

    conn.query(`insert into phases (name) values ('${name}')`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.json({ phase_id: rows.insertId })
    })
})

api_phase.get('/phases/:phase_id', (req, res) => {
    let phase_id = req.params.phase_id

    conn.query(`select * from phases where id = ${phase_id}`, (err, rows, fields) => {
        if (err) {
            res.status(500).json({ error: err })
        }
        if (rows.length)
            res.json(rows[0])
        else
            res.status(400).json({ error: "id not exist" })
    })
})

api_phase.put('/phases/:phase_id', (req, res) => {
    let phase_id = req.params.phase_id
    let name = req.body.name

    if (!name) return res.status(400).json({ error: "name must be non-empty" })

    conn.query(`update phases set name = '${name}' where id = ${phase_id}`, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else
            res.status(200).json({})
    })
})

module.exports = api_phase;