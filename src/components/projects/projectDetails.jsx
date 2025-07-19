import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { communication } from '../../services/communication'; // adjust if needed

const ProjectDetails = () => {
  const { projectName } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await communication.getProjectList("", ""); // or create an API to get by name
        if (response?.data?.result) {
          const match = response.data.result.find(
            p => decodeURIComponent(p.projectName) === decodeURIComponent(projectName)
          );
          if (match) setProject(match);
          else alert("Project not found");
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };
    fetchProject();
  }, [projectName]);

  if (!project) return <p>Loading project...</p>;

  return (
    <div>
      <h2>{project.projectName}</h2>
      <p><strong>Company:</strong> {project.companyName}</p>
      <p><strong>Owner:</strong> {project.ownerName}</p>
      <p><strong>Contact:</strong> {project.ownerNumber}</p>
      <p><strong>Start Date:</strong> {project.startDate}</p>
      <p><strong>End Date:</strong> {project.endDate}</p>
      <p><strong>Status:</strong> {project.status}</p>
    </div>
  );
};

export default ProjectDetails;
