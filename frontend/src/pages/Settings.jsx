import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

function Settings() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user?.user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user.name || "",
        email: user.user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      const { data } = await api.put(
        "/auth/profile",
        {
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      // Dynamically update the user details across the app without reloading
      if (data.user) {
        login({ ...user, user: data.user });
      }

      toast.success(data.message || "Profile updated successfully");
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .settings-root {
          font-family: 'Poppins', sans-serif;
          background: #f5f2ed;
          min-height: calc(100vh - 68px);
          padding: 3rem 2rem;
          color: #1a1a1a;
        }

        .settings-container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .settings-header {
          background: #1a4a8a;
          color: #fff;
          padding: 2.2rem 2.5rem;
        }

        .settings-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .settings-header p {
          color: rgba(255,255,255,0.75);
          font-size: 0.95rem;
        }

        .settings-body {
          padding: 2.5rem;
        }

        .settings-section {
          margin-bottom: 2.5rem;
        }
        
        .settings-section-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a4a8a;
          margin-bottom: 1.5rem;
          padding-bottom: 0.6rem;
          border-bottom: 1.5px solid #f0f3f7;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
        }

        .form-input {
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
          font-family: 'Poppins', sans-serif;
          font-size: 0.95rem;
          color: #111827;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #1a4a8a;
          box-shadow: 0 0 0 3px rgba(26,74,138,0.1);
          background: #fff;
        }

        .save-btn {
          background: #1a4a8a;
          color: #fff;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          width: 100%;
        }

        .save-btn:hover:not(:disabled) {
          background: #0f2d52;
          transform: translateY(-1px);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .settings-root { padding: 1.5rem 1rem; }
          .settings-header, .settings-body { padding: 1.5rem; }
        }
      `}</style>
      <div className="settings-root">
        <div className="settings-container">
          <div className="settings-header">
            <h1>Account Settings</h1>
            <p>Update your personal information and security settings.</p>
          </div>
          
          <div className="settings-body">
            <form onSubmit={handleSubmit}>
              
              <div className="settings-section">
                <h2 className="settings-section-title">Personal Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-input" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      className="form-input" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="you@example.com"
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h2 className="settings-section-title">Security Settings</h2>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Current Password (Required to change password)</label>
                    <input 
                      type="password" 
                      name="currentPassword" 
                      className="form-input" 
                      value={formData.currentPassword} 
                      onChange={handleChange} 
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                      type="password" 
                      name="newPassword" 
                      className="form-input" 
                      value={formData.newPassword} 
                      onChange={handleChange} 
                      placeholder="Create a new password"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword" 
                      className="form-input" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      placeholder="Confirm your new password"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? <><div className="spinner" /> Saving Changes...</> : "💾 Save Changes"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;