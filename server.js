const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB Database
mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// 2. Define Student Schema & Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  status: { type: String, default: 'active' }
});

const Student = mongoose.model('Student', studentSchema);

// 3. API Routes (CRUD Operations)

// CREATE: Insert a new student
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: 'Student added successfully!', student });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ: Fetch all students (with optional course filter)
app.get('/api/students', async (req, res) => {
  try {
    const { course } = req.query;
    let query = course ? { course } : {};
    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Change a student's status
app.put('/api/students/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Student updated successfully!', updatedStudent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a student
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));