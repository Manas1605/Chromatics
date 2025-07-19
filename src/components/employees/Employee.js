import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './employee.css';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    joiningDate: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [filterDept, setFilterDept] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedList = [...employees];
    if (editIndex !== null) {
      updatedList[editIndex] = formData;
    } else {
      updatedList.push(formData);
    }
    setEmployees(updatedList);
    setFormData({ name: '', email: '', phone: '', department: '', joiningDate: '' });
    setEditIndex(null);
    setShowModal(false);
  };

  const handleEdit = (i) => {
    setFormData(employees[i]);
    setEditIndex(i);
    setShowModal(true);
  };

  const handleDelete = (i) => {
    setEmployees(employees.filter((_, idx) => idx !== i));
  };

  const filteredEmployees = filterDept === 'All'
    ? employees
    : employees.filter(emp => emp.department === filterDept);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEmployees.map((emp, i) => ({ SNo: i + 1, ...emp })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, 'employees.xlsx');
  };

  const exportToPDF = () => {
    html2canvas(tableRef.current).then(canvas => {
      const pdf = new jsPDF();
      const img = canvas.toDataURL('image/png');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, width, height);
      pdf.save('employees.pdf');
    });
  };

  return (
    <div className="employee-container">
      <div className="employee-actions">
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Employee</button>
        <select onChange={(e) => setFilterDept(e.target.value)} value={filterDept}>
          <option value="All">All Departments</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Tech">Tech</option>
          <option value="Support">Support</option>
        </select>
        <button onClick={exportToExcel}>Export Excel</button>
        <button onClick={exportToPDF}>Export PDF</button>
      </div>

      <div className="employee-table-wrapper" ref={tableRef}>
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, i) => (
              <tr key={i}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.department}</td>
                <td>{emp.joiningDate}</td>
                <td>
                  <button onClick={() => handleEdit(i)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(i)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <h2>{editIndex !== null ? "Edit" : "Add"} Employee</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input name="phone" type="text" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Tech">Tech</option>
                <option value="Support">Support</option>
              </select>
              <input name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required />
              <div className="modal-actions">
                <button type="submit">{editIndex !== null ? "Update" : "Add"}</button>
                <button type="button" onClick={() => { setShowModal(false); setFormData({ name: '', email: '', phone: '', department: '', joiningDate: '' }); setEditIndex(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
