
import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { communication } from "../../services/communication";
  


const Dashboard = () => {
  const [value, setValue] = useState([]);
   const stats = [
    { label: "Total Users", value: 1250 },
    { label: "Active Projects", value: 15 },
    { label: "Pending Tasks", value: 42 },
    { label: "Revenue", value: 12430 },
  ];
  const [animatedValues, setAnimatedValues] = useState(
    stats.map(() => 0) // Initial values
  );
  // const [products, setProducts] = useState([]);

  // const dashboardValue = async () => {
  //   try {
  //     const response = await communication.getDashboardValue();
  // console.log("response", response);
  //     if (response?.data?.success) {
  //       setValue(response?.data?.category);
  //     }
  //   } catch (error) {
  //     throw error
  //   }
  // };

  // useEffect(() => {
  //   dashboardValue();
  // }, []);
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  useEffect(() => {
    const intervals = stats.map((stat, i) => {
      return setInterval(() => {
        setAnimatedValues(prev => {
          const newValues = [...prev];
          if (newValues[i] < stat.value) {
            newValues[i] += Math.ceil(stat.value / 50);
            if (newValues[i] > stat.value) newValues[i] = stat.value;
          }
          return newValues;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, []);
  return (

    <div className="dashboard">
       <div className="cards">
        {stats.map((stat, i) => (
          <div className="card" key={i} onMouseMove={handleMouseMove}>
            <h3>{stat.label}</h3>
            <p>{stat.label === "Revenue" ? `₹${animatedValues[i]}` : animatedValues[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
