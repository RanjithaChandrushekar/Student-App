import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    course: 'MERN Stack',
    status: 'active'
  });
  const [filterCourse, setFilterCourse] = useState('');

  const API_URL = 'http://localhost:5000/api/students';

  // Fetch students (with optional filter)
  const fetchStudents = async () => {
    try {
      let url = API_URL;
      if (filterCourse) {
        url += `?course=${encodeURIComponent(filterCourse)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filterCourse]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add Student (CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age)
        })
      });
      if (response.ok) {
        setFormData({ name: '', age: '', course: 'MERN Stack', status: 'active' });
        fetchStudents();
      }
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  // Update Status (UPDATE)
  const handleUpdateStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'completed' : 'active';
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        fetchStudents();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Delete Student (DELETE)
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchStudents();
      }
    } catch (err) {
      console.error('Error deleting student:', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎓 Student Management Dashboard (React + MongoDB)</h2>

      {/* Add Form */}
      <div style={styles.card}>
        <h3>Add New Student</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="course"
            placeholder="Course (e.g., MERN Stack)"
            value={formData.course}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <select name="status" value={formData.status} onChange={handleChange} style={styles.input}>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit" style={styles.button}>Add Student</button>
        </form>
      </div>

      {/* Filter Section */}
      <div style={styles.card}>
        <h3>Filter by Course</h3>
        <input
          type="text"
          placeholder="Enter course name (e.g., MERN Stack)"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={styles.input}
        />
        {filterCourse && (
          <button onClick={() => setFilterCourse('')} style={styles.clearBtn}>Clear Filter</button>
        )}
      </div>

      {/* Student List */}
      <div style={styles.card}>
        <h3>Student Records ({students.length})</h3>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <ul style={styles.list}>
            {students.map((student) => (
              <li key={student._id} style={styles.listItem}>
                <div>
                  <strong>{student.name}</strong> ({student.age} yrs) - <em>{student.course}</em>
                  <br />
                  <span style={{ 
                    color: student.status === 'completed' ? 'green' : student.status === 'active' ? 'blue' : 'orange' 
                  }}>
                    Status: {student.status}
                  </span>
                </div>
                <div>
                  <button 
                    onClick={() => handleUpdateStatus(student._id, student.status)}
                    style={styles.actionBtn}
                  >
                    Toggle Status
                  </button>
                  <button 
                    onClick={() => handleDelete(student._id)} 
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Inline Styles for simplicity
const styles = {
  container: { maxWidth: '600px', margin: '30px auto', fontFamily: 'Arial, sans-serif', padding: '20px' },
  card: { background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  clearBtn: { padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '5px' },
  list: { listStyle: 'none', padding: '0' },
  listItem: { background: '#fff', border: '1px solid #ddd', padding: '12px', borderRadius: '4px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actionBtn: { padding: '6px 10px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  deleteBtn: { padding: '6px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default App;