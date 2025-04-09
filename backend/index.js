const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const config = require('./config.json');

// Import models
const Program = require('./models/program.model');
const User = require('./models/users.model');
const Registration = require('./models/Registration'); // Registration model

const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB using the connection string from config.json
mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

/* Uncomment when building project */
// app.use(express.static(path.join(__dirname, '../frontend/dist')));
// app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
// });

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

// ---- Programs Endpoints ----

// GET all programs
app.get("/programs", async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

// POST a new program
app.post("/programs", async (req, res) => {
  try {
    const {
      programName,
      type,
      instructor,
      startDate,
      endDate,
      startTime,
      endTime,
      availableDays,
      location,
      capacity,
      memberPrice,
      nonMemberPrice,
      desc,
      enrolled
    } = req.body;

    const program = new Program({
      programName,
      type,
      instructor,
      startDate,
      endDate,
      startTime,
      endTime,
      availableDays,
      location,
      capacity,
      memberPrice,
      nonMemberPrice,
      desc,
      enrolled
    });
    await program.save();
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: "Failed to create program" });
  }
});

// PUT to increment enrollment for a program
app.put("/programs/:id/enrollment", async (req, res) => {
  try {
    const programId = req.params.id;
    const program = await Program.findByIdAndUpdate(
      programId,
      { $inc: { enrolled: 1 } },
      { new: true }
    );
    if (!program) return res.status(404).json({ message: "Course not found" });
    res.json(program);
  } catch (error) {
    res.status(500).json({ error: "Failed to update enrollment" });
  }
});

// DELETE a program
app.delete("/programs/:id", async (req, res) => {
  try {
    const programId = req.params.id;
    const program = await Program.findOne({ _id: programId });
    if (!program) {
      return res.status(404).json({ error: true, message: "Program not found" });
    }
    await Program.deleteOne({ _id: programId });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete program" });
  }
});

// ---- User Endpoints ----

// Sign-up
app.post("/sign-up", async (req, res) => {
  const { username, password, firstName, lastName, email, phone } = req.body;
  if (!username || !password) {
    return res.json({ message: "No user" });
  }
  try {
    const user = new User({ username, password, firstName, lastName, email, phone });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to sign up user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json(null);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
});

// Get user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json(null);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
});

// PATCH to update family info for a user
app.patch("/users/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { family: data } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(400).json(null);
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ---- Registration Endpoints ----

// GET all registrations (with populated member and program details)
app.get("/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("memberId", "firstName lastName email")
      .populate("programId", "programName type startDate endDate location");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

// GET registrations for a specific user (member)
app.get("/registrations/my-registrations/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    console.log("Received memberId from URL:", memberId);

    const validMemberId = new mongoose.Types.ObjectId(memberId);
    console.log("Converted memberId:", validMemberId);

    const registrations = await Registration.find({ memberId: validMemberId })
      .populate("programId", "programName type instructor startDate endDate location capacity memberPrice nonMemberPrice desc enrolled availableDays");
    
    console.log("Fetched registrations for member", memberId, ":", registrations);
    res.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations for member:", error);
    res.status(500).json({ error: "Failed to fetch registrations for member", details: error.message });
  }
});

// POST a new registration
app.post("/registrations", async (req, res) => {
  const { memberId, programId } = req.body;
  try {
    // Prevent duplicate registration
    const existing = await Registration.findOne({ memberId, programId });
    if (existing) {
      return res.status(400).json({ error: "Member is already registered for this class" });
    }
    const registration = new Registration({ memberId, programId });
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: "Failed to register for class" });
  }
});

// DELETE a registration
app.delete("/registrations/:id", async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: "Registration deleted", registration });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

app.listen(8000, () => console.log("Server listening on port 8000"));

module.exports = app;
