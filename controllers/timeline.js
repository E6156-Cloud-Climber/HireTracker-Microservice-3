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
                    data.push({ position_id: row.position_id, posts: [], links: { position: `/positions/${row.position_id}` } })
                }
                delete row.user_id
                delete row.position_id
                delete row.max_date
                row.links = {
                    phase: `/phases/${row.phase_id}`,
                    user: `/users/${row.user_id}`,
                    position: `/positions/${row.position_id}`
                }
                data[data.length - 1].posts.push(row)
            })
            res.json({ timelines: data })
        }
    })
})

api_timeline.get('/positions/:position_id/timeline', (req, res) => {
    let position_id = req.params.position_id

    let sql = `select * from posts where position_id = ${position_id} order by user_id, date`

    conn.query(sql, (err, rows, fields) => {
        if (err)
            res.status(500).json({ error: err })
        else {
            let user_tls = []
            let longest_tl_idx = 0
            rows.forEach((row, idx) => {
                if (user_tls.length == 0 || row.user_id != user_tls[user_tls.length - 1].user_id) {
                    if (user_tls.length > 0 && user_tls[user_tls.length - 1].posts.length > user_tls[longest_tl_idx].posts.length)
                        longest_tl_idx = idx
                    user_tls.push({ user_id: row.user_id, posts: [] })
                }
                user_tls[user_tls.length - 1].posts.push(row)
            })
            let phases = []
            user_tls[longest_tl_idx].posts.forEach((post) => {
                phases.push({ phase_id: post.phase_id, total: 0, dates: [], durations: [] })
            })
            user_tls.forEach((tl) => {
                let phase_idx = 0
                tl.posts.every((post, post_idx, posts) => {
                    while (phase_idx < phases.length && phases[phase_idx].phase_id != post.phase_id)
                        phase_idx++
                    if (phase_idx >= phases.length)
                        return false
                    phases[phase_idx].total++
                    phases[phase_idx].dates.push(post.date)
                    if (post_idx + 1 < posts.length)
                        phases[phase_idx].durations.push(Date.parse(posts[post_idx + 1].date) - Date.parse(post.date))
                    phase_idx++
                    return true
                })
            })
            try {
            phases.forEach((phase, idx) => {
                if (idx + 1 < phases.length) {
                    phase.pass_cnt = phases[idx + 1].total
                    phase.pass_rate = phase.pass_cnt / phase.total
                }
                let dates = phase.dates
                dates.sort((a, b) => Date.parse(a) - Date.parse(b))
                phase.date = {}
                phase.date.min = dates[0].toISOString().slice(0, 10)
                phase.date.max = dates[dates.length - 1].toISOString().slice(0, 10)
                if (dates.length % 2 == 1)
                    phase.date.mid = dates[Math.floor(dates.length / 2)].toISOString().slice(0, 10)
                else
                    phase.date.mid = new Date((Date.parse(dates[dates.length / 2 - 1]) + Date.parse(dates[dates.length / 2])) / 2).toISOString().slice(0, 10)
                phase.durations.sort()
                if (phase.durations.length > 0) {
                    phase.duration = {}
                    phase.duration.min = phase.durations[0] / 86400 / 1000
                    phase.duration.max = phase.durations[phase.durations.length - 1] / 86400 / 1000
                    if (phase.durations.length % 2 == 1)
                        phase.duration.mid = phase.durations[phase.durations.length / 2] / 86400 / 1000
                    else
                        phase.duration.mid = (phase.durations[phase.durations.length / 2 - 1] + phase.durations[phase.durations.length / 2]) / 2 / 86400 / 1000
                }
                delete phase.dates
                delete phase.durations
                phase.links = { phase: `/phases/${phase.phase_id}` }
            })
            res.json({ phases: phases, links: { position: `/positions/${position_id}` } })

            }
            catch (err) {
                console.log(err)
                console.log(phases)
                res.status(500).json({ error: err })
            }
        }
    })
})

module.exports = api_timeline;