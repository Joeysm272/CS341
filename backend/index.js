const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();

app.use(express.json());

/*Uncomment when building project*/
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
//   });

app.use(cors({origin:"*"}));

app.get('/', (req, res) => {
    res.json({message: "hello"});
})


app.listen(8000);

module.exports = app;