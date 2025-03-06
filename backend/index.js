const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config.json');
const Program = require('./models/program.model');

const app = express();

app.use(express.json());

mongoose.connect(config.connectionString);

/*Uncomment when building project*/
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
//   });

app.use(cors());

app.get('/', (req, res) => {
    res.json({message: "hello"});
})

app.get('/programs', async (req, res) => {
    const programs = await Program.find();
    return res.json(programs);
})

app.post('/programs', async (req, res) => {
    const {programName, type, instructor, time, location, capacity, memberPrice, nonMemberPrice, desc, enrolled} = req.body;

    const program = new Program({
        programName, type, instructor, time, location, capacity, memberPrice, nonMemberPrice, desc, enrolled
    })
    await program.save();
    res.json(program);
})

app.put('/programs/:id/enrollment', async (req, res) => {
    const programId = req.params.id;

    const program = await Program.findByIdAndUpdate(programId, {$inc: {enrolled: 1}}, {new: true});
    if (!program) return res.status(404).json({ message: 'Course not found' });
    res.json(program);
})

app.delete('/programs/:id', async (req, res) => {
    const programId = req.params.id

    const program = await Program.findOne({_id: programId});

    if(!program){
        return res.status(404).json({error: true, message: 'Program not found'});
    }

    await Program.deleteOne({_id: programId});

    return res.json({message: 'deleted successfully'})
})




app.listen(8000);

module.exports = app;