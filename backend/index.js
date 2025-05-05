const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const config = require('./config.json');
const bcrypt = require('bcrypt');

// Import models
const Program = require('./models/program.model');
const User = require('./models/users.model');
const Registration = require('./models/Registration');
const Notification = require('./models/Notifications');

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

// PUT endpoint for updating an existing program
app.put('/programs/:id', async (req, res) => {
  try {
    const programId = req.params.id;
    const updatedProgram = await Program.findByIdAndUpdate(programId, req.body, { new: true });
    if (!updatedProgram) return res.status(404).json({ error: "Program not found" });
    res.json(updatedProgram);
  } catch (error) {
    res.status(500).json({ error: "Failed to update program", details: error.message });
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

const saltRounds = 10; // cost factor, adjust this value as needed

app.post("/sign-up", async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, phone, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const userRole = role || 'member';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      password: hashedPassword,  // Store the hash, not the plain text password.
      firstName,
      lastName,
      email,
      phone,
      role: userRole
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ error: "Failed to sign up user" });
  }
});


// Login

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !user.active) {
      console.log("User not found:", username);
      return res.status(400).json({ error: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid for ${username}?`, isPasswordValid);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error);
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

// ---- DELETE /users/:id (deactivate user + delete their registrations) ----
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { active: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    await Registration.deleteMany({ memberId: userId });

    res.json({ message: 'User deactivated and registrations deleted.' });
  } catch (err) {
    console.error("Error deactivating user:", err);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});



// ---- Registration Endpoints ----

// GET all registrations (with populated member and program details)
app.get("/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate("memberId", "firstName lastName email")
      .populate("programId", "programName type startDate endDate startTime endTime location cancelled");
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
      .populate("programId", "programName type instructor startDate endDate startTime endTime location capacity memberPrice nonMemberPrice desc enrolled availableDays cancelled");
    
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
    // Prevent duplicate registration for the same class
    const existing = await Registration.findOne({ memberId, programId });
    if (existing) {
      return res.status(400).json({ error: "Member is already registered for this class" });
    }

    // Fetch the new program details to check its schedule
    const newProgram = await Program.findById(programId);
    if (!newProgram) {
      return res.status(404).json({ error: "Program not found" });
    }

    // Fetch all registrations for this member (populated with program details)
    const userRegistrations = await Registration.find({ memberId }).populate("programId");

    // Define a helper function to check if two date ranges overlap
    const rangesOverlap = (startA, endA, startB, endB) => {
      const aStart = new Date(startA);
      const aEnd = new Date(endA);
      const bStart = new Date(startB);
      const bEnd = new Date(endB);
      return aStart <= bEnd && bStart <= aEnd;
    };

    // Check for scheduling conflicts with each registration the user already has
    for (const reg of userRegistrations) {
      const registeredProgram = reg.programId;
      if (!registeredProgram) continue;

      const dateConflict = rangesOverlap(newProgram.startDate, newProgram.endDate, registeredProgram.startDate, registeredProgram.endDate);
      const dayConflict = newProgram.availableDays.some(day => registeredProgram.availableDays.includes(day));
      const timeConflict = newProgram.startTime === registeredProgram.startTime;

      if (dateConflict && dayConflict && timeConflict) {
        return res.status(400).json({
          error: "Double booking detected: You are already registered for a class that conflicts with the selected class."
        });
      }
    }

    const registration = new Registration({ memberId, programId });
    await registration.save();

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ error: "Failed to register for class", details: error.message });
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

// ---- Notifications Endpoint ----
app.put('/programs/:id/cancel', async (req, res) => {
  try {
    const programId = req.params.id;
    
    // Mark the program as cancelled.
    const program = await Program.findByIdAndUpdate(
      programId,
      { cancelled: true },
      { new: true }
    );
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    
    // Retrieve all registrations for this program
    const registrations = await Registration.find({ programId });
    
    // Create a notification for each registered member
    for (const reg of registrations) {
      const notification = new Notification({
        userId: reg.memberId,
        message: `The class "${program.programName}" has been cancelled.`,
      });
      await notification.save();
    }
    
    res.json({ message: 'Class cancelled and notifications sent.' });
  } catch (error) {
    console.error("Error cancelling class:", error);
    res.status(500).json({ error: "Failed to cancel class", details: error.message });
  }
});

app.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ date: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
});

// GET /reports/registrations?start=YYYY-MM-DD&end=YYYY-MM-DD
app.get('/reports/registrations', async (req, res) => {
  const { start, end } = req.query;
  if (!start || !end) return res.status(400).json({ error: 'Missing dates' });
  try {
    const regs = await Registration.find({
      registrationDate: {
        $gte: new Date(start),
        $lte: new Date(end + 'T23:59:59')
      }
    })
      .populate('memberId', 'firstName lastName')
      .populate('programId', 'programName type startDate endDate')
      .exec();
    res.json(regs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});



app.listen(8000, () => console.log("Server listening on port 8000"));

module.exports = app;
