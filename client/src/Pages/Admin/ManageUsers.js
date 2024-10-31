import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../CSS/Admin/ManageUsers.css";
import EditUserModal from "./EditUserModal";
import { useNavigate } from "react-router-dom";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import EditUserQuotaModal from "./EditUserQuotaModal";
import EditUserSubModal from "./EditUserSubModal";

export default function ManageUsers() {
  const [users, setUsers] = useState();
  const backendurl = process.env.REACT_APP_BACKEND_URL;
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserQuota, setSelectedUserQuota] = useState(null);
  const [selectedUserSub, setSelectedUserSub] = useState(null);
  const [editTrigger, setEditTrigger] = useState(false);
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
  }, [editTrigger]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  const handleDeleteClick = async (user) => {
    Confirm.show(
      "Kullanıcıyı Sil",
      "Kullanıcıyı Silmek İstiyor Musunuz?",
      "Evet",
      "Hayır",
      async () => {
        // delete user
        const token = localStorage.getItem("token");
        try {
          var res = await axios.delete(`${backendurl}admin/deleteUser`, {
            headers: {
              Authorization: token,
            },
            data: {
              uid: user.uid,
            },
          });
          if (res.status == 200) {
            Notify.success("Kullanıcı Silindi");
          } else {
            Notify.failure("Kullanıcı Silinemedi");
          }
        } catch (e) {
          console.log(e);
          const str = "Kullanıcı Silinemedi: " + e.response.data.data;
          Notify.failure(str);
        } finally {
          setEditTrigger((prev) => !prev);
        }
      },
      () => {
        // do nothing
      },
      {
        // custom options
      }
    );
  };

  const handleUserUpdate = async (updatedUser) => {
    // post update to backend
    setSelectedUser(null); // close modal
    const token = localStorage.getItem("token");
    try {
      var res = await axios.put(`${backendurl}admin/updateUser`, updatedUser, {
        headers: {
          Authorization: `${token}`,
        },
      });
      if (res.status == 200) {
        Notify.success("Kullanıcı Güncellendi");
      } else {
        Notify.failure("Kullanıcı Güncellenemedi");
      }
    } catch (e) {
      console.log(e);
      const str = "Kullanıcı Güncellenemedi: " + e.response.data.data;
      Notify.failure(str);
    } finally {
      setEditTrigger((prev) => !prev);
    }
  };

  const handleQuotaClick = async (user) => {
    setSelectedUserQuota(user);
  };

  const handleQuotaUpdate = async (updatedQuota) => {
    setSelectedUserQuota(null); // close modal
    const token = localStorage.getItem("token");
    try {
      var res = await axios.put(
        `${backendurl}admin/updateUserQuota`,
        updatedQuota,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      if (res.status == 200) {
        Notify.success("Kullanıcı Kotası Güncellendi");
      } else {
        Notify.failure("Kullanıcı Kotası Güncellenemedi");
      }
    } catch (e) {
      console.log(e);
      const str = "Kullanıcı Kotası Güncellenemedi: " + e.response.data.data;
      Notify.failure(str);
    } finally {
      setEditTrigger((prev) => !prev);
    }
  };

  const handleSubEditClick = (user) => {
    setSelectedUserSub(user);
  };

  const handleSubsUpdate = async (user) => {
    Confirm.show(
      "Kullanıcı Aboneliği",
      `Kullanıcıya ${user.subscriptionType} abonelik tanımlamak istiyor musunuz?`,
      "Evet",
      "Hayır",
      // update user subs
      async () => {
        const token = localStorage.getItem("token");
        try {
          var res = await axios.put(
            `${backendurl}admin/updateUserSubscription`,
            { uid: user.uid, subscriptionType: user.subscriptionType },
            {
              headers: {
                Authorization: `${token}`,
              },
            }
          );
          if (res.status == 200) {
            Notify.success("Kullanıcı Aboneliği Güncellendi");
          } else {
            Notify.failure("Kullanıcı Aboneliği Güncellenemedi");
          }
        } catch (e) {
          console.log(e);
          const str =
            "Kullanıcı Aboneliği Güncellenemedi: " + e.response.data.data;
          Notify.failure(str);
        } finally {
          setEditTrigger((prev) => !prev);
        }
      },
      () => {
        // do nothing
      },
      {
        // custom options
      }
    );
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="manageUsersContainer">
      <div className="usersContent">
        <h2>Manage Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="adminPageTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>İsim</th>
                <th>Soyisim</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Kota</th>
                <th>Kayıt Tarihi</th>
                <th>Abonelik Bitiş Tarihi</th>
                <th>Role</th>
                <th>Yönet</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.uid}</td>
                    <td>{user.firstname}</td>
                    <td>{user.lastname}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.quota}</td>
                    <td>{formatDate(user.registrationDate)}</td>
                    <td>{formatDate(user.subscriptionEndDate)}</td>
                    <td>{user.role}</td>
                    <td className="actions">
                      <button
                        onClick={() => {
                          handleEditClick(user);
                        }}
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={async () => {
                          await handleDeleteClick(user);
                        }}
                      >
                        Sil
                      </button>
                      <button
                        onClick={async () => {
                          await handleQuotaClick(user);
                        }}
                      >
                        Kota Güncelle
                      </button>
                      <button
                        onClick={async () => {
                          handleSubEditClick(user);
                        }}
                      >
                        Abonelik Tanımlama
                      </button>
                      {/* <button
                        onClick={async () => {
                          await handleSubsUpdate(user, "yearly");
                        }}
                      >
                        Yıllık Abonelik Güncelle
                      </button> */}
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
      {selectedUserQuota && (
        <div className="modal">
          <EditUserQuotaModal
            user={selectedUserQuota}
            onClose={() => setSelectedUserQuota(null)}
            onSave={handleQuotaUpdate}
          />
        </div>
      )}
      {selectedUserSub && (
        <div className="modal">
          <EditUserSubModal
            user={selectedUserSub}
            onClose={() => setSelectedUserSub(null)}
            onSave={handleSubsUpdate}
          />
        </div>
      )}
    </div>
  );
}
