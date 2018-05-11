const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080;
const search = require('./app.js')


app.get("/searchFlights/:origin/:destination", (req, res) => {
    if (req.params.origin.length === 3 && req.params.destination.length === 3) {
        let origin = req.params.origin;
        let destination = req.params.destination
        search.searchFlights(origin.toUpperCase(), destination.toUpperCase())
        res.send('<h1>Response in console</h1>')
    } else {
        res.send('<h1>Flight codes must be 3 letters</h1>')
    }
});

app.get('*', function (req, res) {
    res.send('<h1>url must match format /searchFlights/{Origin}/{Destination} </h1>')
});

app.listen(PORT, () => {
    console.log(`Search Flights App listening on port ${PORT}!`);
});