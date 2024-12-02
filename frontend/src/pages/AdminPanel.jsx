import React, { useEffect, useState } from "react";
import api from "../utils/api"; 
import classes from "../style/AdminPanel.module.css"; 

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("No token found, please log in as admin.");
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const usersData = await api.getUsers(token);
        setUsers(usersData); 
      } catch (error) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className={classes.loading}>Loading...</div>;
  if (error) return <div className={classes.error}>{error}</div>;

  return (
    <div className={classes.adminPanel}>
      <h1 className={classes.heading}>Admin Panel</h1>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>מייל</th>
            <th>משמרות</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.mail}</td>
              <td>{user.workDaysLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
