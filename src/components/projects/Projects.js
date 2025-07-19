import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './projects.css';
import { communication } from '../../services/communication';
import { useNavigate } from 'react-router-dom';


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [filter, setFilter] = useState('All');
  const tableRef = useRef();
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    projectName: '',
    companyName: '',
    ownerName: '',
    ownerNumber: '',
    startDate: '',
    endDate: '',
    status: 'pending',
  });

  useEffect(() => {
    getProjectList();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getProjectList = async () => {
    setLoading(true); // Start loading
    try {
      const response = await communication.getProjectList("", "");
      if (response?.data) {
        setProjects(response.data.result);
      }
    } catch (error) {
      console.error("Failed to fetch project list:", error);
    } finally {
      setLoading(false); // End loading
    }
  };


  const handleAddOrUpdateProject = async (e) => {
    e.preventDefault();

    try {
      if (editProjectId) {
        // Update
        const updatedData = { ...formData, _id: editProjectId };
        const response = await communication.updateProject(updatedData);

        if (response?.data) {
          alert("Project updated successfully.");
          setProjects(prev =>
            prev.map(p => p._id === editProjectId ? { ...p, ...formData } : p)
          );
        } else {
          alert("Failed to update project.");
        }
      } else {
        // Create
        const response = await communication.createProject(formData);
        if (response?.data) {
          alert("Project created successfully.");
          getProjectList();
        } else {
          alert("Failed to create project.");
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("An error occurred while saving the project.");
    }

    // Reset
    setFormData({
      projectName: '',
      companyName: '',
      ownerName: '',
      ownerNumber: '',
      startDate: '',
      endDate: '',
      status: 'pending',
    });
    setEditProjectId(null);
    setShowModal(false);
  };

  const handleEdit = async (projectId) => {
    try {
      const response = await communication.getProjectDetailById(projectId);
      if (response?.data?.result) {
        const project = response.data.result;

        const formatDateSafe = (dateStr) => {
          if (!dateStr) return '';
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? dateStr : d.toISOString().split("T")[0];
        };

        setFormData({
          ...project,
          startDate: formatDateSafe(project.startDate),
          endDate: formatDateSafe(project.endDate),
        });
        setEditProjectId(projectId);
        setShowModal(true);
      } else {
        alert("Failed to fetch project details.");
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
      alert("An error occurred while fetching project details.");
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const response = await communication.deleteProject(projectId);
      if (response?.data) {
        setProjects(prev => prev.filter(p => p._id !== projectId));
        alert("Project deleted successfully.");
      } else {
        alert("Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  const navigate = useNavigate();

  return (
    <div className="project-container">
      <div className="project-actions">
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Project</button>
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editProjectId ? 'Edit Project' : 'Add Project'}</h2>
            <form className="project-form" onSubmit={handleAddOrUpdateProject}>
              <input name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Project Name" required />
              <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required />
              <input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner Name" required />
              <input name="ownerNumber" type="number" value={formData.ownerNumber} onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  handleChange(e);
                }
              }} placeholder="Owner Number" required />
              <label>Start Date:</label>
              <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
              <label>Completion Date:</label>
              <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
              <label>Status:</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
              <div className="modal-actions">
                <button type="submit">{editProjectId ? 'Update Project' : 'Add Project'}</button>
                <button type="button" onClick={() => { setShowModal(false); setEditProjectId(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="project-table-wrapper" ref={tableRef}>
        <table className="project-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Company</th>
              <th>Owner</th>
              <th>Contact</th>
              <th>Start</th>
              <th>Completion</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  Loading projects...
                </td>
              </tr>
            ) : (
              filteredProjects.map((proj) => (
                <tr
                  key={proj._id}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                  style={{ cursor: 'pointer' }}
                >
                  <td 
                    onClick={() => navigate(`/project-details/${encodeURIComponent(proj.projectName)}`)}>
                    {proj.projectName}
                  </td>
                  <td>{proj.companyName}</td>
                  <td>{proj.ownerName}</td>
                  <td>{proj.ownerNumber}</td>
                  <td>{formatDate(proj.startDate)}</td>
                  <td>{formatDate(proj.endDate)}</td>
                  <td>{proj.status}</td>
                  <td>
                    <button onClick={() => handleEdit(proj._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px"
                        viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(proj._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                        fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
            {!loading && filteredProjects.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                  No projects found for "{filter}" status.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
