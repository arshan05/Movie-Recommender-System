const express = require('express')
const app = express()
const { PythonShell } = require('python-shell')
const cors = require('cors')
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.post('/api/recommendations', async (req, res, next) => {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'],
        args: [req.body.movieName]
    }

    PythonShell.run('./app.py', options, function (err, results) {
        if (err) { console.log(err); return; }
        // console.log(results.toString())
        let recommended_movie_names = []
        let recommended_movie_posters = []
        let recommended_movie_ids = []
        // let current_movie_id = 0
        let result = []

        recommended_movie_names = eval(eval(results)[0])
        recommended_movie_posters = eval(eval(results)[1])
        recommended_movie_ids = eval(eval(results)[2])
        // current_movie_id = eval(eval(results)[3])

        for (let i = 0; i < 5; i++) {
            result.push({
                title: recommended_movie_names[i],
                poster: recommended_movie_posters[i],
                id: recommended_movie_ids[i]
            })
        }
        res.json(result)
        // res.json({ result: result, currentMovieId: current_movie_id })
    })
})

if (process.env.NODE_ENV === 'production') {
    const path = require('path')
    app.use(express.static('client/build'));
    app.use('*', (req, res) => {
        res.send(path.join(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT)
})
