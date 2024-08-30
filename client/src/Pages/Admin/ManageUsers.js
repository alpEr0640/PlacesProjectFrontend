import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../CSS/Admin/ManageUsers.css";
import EditUserModal from "./EditUserModal";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const getUsers = async (token) => {
    try {
      var res = await axios.get(`${backendurl}admin/getUsers`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      setUsers(res.data.users);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    getUsers(token);
  }, []);

  useEffect(() => {
    if (users) {
      // list users
      console.log("Updated users:", users);
    }
  }, [users]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleUserUpdate = async (updatedUser) => {
    // post update to backend
    setSelectedUser(null); // Modal'ı kapat
    const token = localStorage.getItem("token");
    try {
      var res = await axios.post(`${backendurl}admin/updateUser`, updatedUser, {
        headers: {
          Authorization: `${token}`,
        },
      });
    } catch (e) {
      console.log(e);
    }
    window.location.reload();
  };

  return (
    <div className="manageUsersContainer">
      <div className="usersContent">
        <h2>Manage Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table border="1" cellPadding="10" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Kota</th>
                <th>Kayıt Tarihi</th>
                <th>Role</th>
                <th>Yönet</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.uid}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.quota}</td>
                    <td>{user.registrationDate}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        onClick={() => {
                          handleEditClick(user);
                        }}
                      >
                        Düzenle
                      </button>
                      <button>Sil</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Kullanıcı Bulunamadı</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <div className="modal">
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleUserUpdate}
          />
        </div>
      )}
    </div>
  );
}
