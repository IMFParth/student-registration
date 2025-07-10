import React, { useState } from 'react';

const StudentRegistration = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNo: '',
    password: '',
    confirmPassword: '',
    contact: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setStudents([...students, formData]);
    setFormData({ firstName: '', lastName: '', rollNo: '', password: '', confirmPassword: '', contact: '' });
  };

  const handleDelete = (rollNo) => {
    setStudents(students.filter(student => student.rollNo !== rollNo));
  };

  const handleUpdate = (rollNo) => {
    const studentToUpdate = students.find(student => student.rollNo === rollNo);
    if (studentToUpdate) {
      const updatedContact = prompt("Enter new contact number:", studentToUpdate.contact);
      if (updatedContact) {
        setStudents(students.map(student => student.rollNo === rollNo ? { ...student, contact: updatedContact } : student));
      }
    } else {
      alert("Student not found!");
    }
  };

  return (
    <div>
      <h1>Student Registration System</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <br></br>
        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <br></br>
        <input type="text" name="rollNo" placeholder="Roll No/ID" value={formData.rollNo} onChange={handleChange} required />
        <br></br>
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <br></br>
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <br></br>
        <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
        <br></br>
        <button type="submit">Register Student</button>
      </form>

      <h2>Student Records</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Roll No/ID</th>
            <th>Contact Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.rollNo}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.rollNo}</td>
              <td>{student.contact}</td>
              <td>
                <button onClick={() => handleUpdate(student.rollNo)}>Update</button>
                <button onClick={() => handleDelete(student.rollNo)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentRegistration;
