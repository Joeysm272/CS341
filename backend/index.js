const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config.json');
const Program = require('./models/program.model');
const User = require('./models/users.model');

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
    const {programName, type, instructor, startDate, endDate, availableDays, location, capacity, memberPrice, nonMemberPrice, desc, enrolled} = req.body;

    const program = new Program({
        programName, type, instructor, startDate, endDate, availableDays, location, capacity, memberPrice, nonMemberPrice, desc, enrolled
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

app.post('/sign-up', async (req, res) => {
    const {username, password, firstName, lastName, email, phone} = req.body;

    if(!username || !password){
        return res.json({message: 'No user'})
    }

    const user = new User({
        username, password, firstName, lastName, email, phone
    })
    await user.save();
    res.json(user);

})

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username: username});
    
    if(!user || user.password !== password){
        return res.status(400).json(null);
    }
    
    return res.json(user).status(200)

});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({_id: id});

    if(!user){
        return res.status(400).json(null);
    }

    return res.json(user).status(200);
})

app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { $push: { family: data } },
          { new: true } 
        );

        if(!updatedUser){
            return res.status(400).json(null);
        }

        return res.json(updatedUser).status(200);

    }catch(error){
        return error
    }
})


app.listen(8000);

module.exports = app;