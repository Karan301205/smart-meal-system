import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student', mealsLeft: ''
    });

    
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://smart-meal-system.onrender.com/api/auth/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            alert("Access Denied: Admin Only");
            navigate('/dashboard');
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // 2. Handle Add User
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://smart-meal-system.onrender.com/api/auth/register', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("User Added Successfully!");
            setFormData({ name: '', email: '', password: '', role: 'student', mealsLeft: '' });
            fetchUsers(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.msg || "Error adding user");
        }
    };

    // 3. Handle Delete User
    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://smart-meal-system.onrender.com/api/auth/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
        } catch (err) {
            alert("Failed to delete user");
        }
    };

    // Helper: Split users by role
    const staffMembers = users.filter(u => u.role === 'staff' || u.role === 'admin');
    const students = users.filter(u => u.role === 'student' || u.role === 'guest');

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.content}>
                
                {/* LEFT: Add User Form */}
                <div style={styles.formCard}>
                    <h2 style={styles.header}>Add New <span style={{color:'var(--primary-red)'}}>User</span></h2>
                    <form onSubmit={handleRegister} style={styles.form}>
                        <input style={styles.input} placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        <input style={styles.input} placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                        <input style={styles.input} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                        
                        <select style={styles.select} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                            <option value="guest">Guest</option>
                        </select>

                        {/* Show Meals Input ONLY for Guest */}
                        {formData.role === 'guest' && (
                            <input style={styles.input} type="number" placeholder="Number of Meals" value={formData.mealsLeft} onChange={e => setFormData({...formData, mealsLeft: e.target.value})} required />
                        )}

                        <button style={styles.addBtn}>+ Create Account</button>
                    </form>
                </div>

                {/* RIGHT: User Lists */}
                <div style={styles.listSection}>
                    
                    {/* Staff List */}
                    <div style={styles.listCard}>
                        <h3 style={styles.subHeader}>👨‍🍳 Staff & Admins</h3>
                        {staffMembers.map(user => (
                            <div key={user._id} style={styles.userRow}>
                                <div>
                                    <p style={{fontWeight:'bold'}}>{user.name}</p>
                                    <p style={{fontSize:'0.8rem', color:'#888'}}>{user.role.toUpperCase()}</p>
                                </div>
                                <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Remove</button>
                            </div>
                        ))}
                    </div>

                    {/* Student List */}
                    <div style={styles.listCard}>
                        <h3 style={styles.subHeader}>🎓 Students & Guests</h3>
                        {students.map(user => (
                            <div key={user._id} style={styles.userRow}>
                                <div>
                                    <p style={{fontWeight:'bold'}}>{user.name}</p>
                                    <p style={{fontSize:'0.8rem', color:'#888'}}>
                                        {user.role === 'guest' ? `Guest (${user.mealsLeft} meals left)` : user.email}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(user._id)} style={styles.deleteBtn}>Remove</button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', padding: '20px' },
    content: { display: 'flex', gap: '30px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' },
    formCard: { flex: '1', minWidth: '300px', backgroundColor: 'var(--card-dark)', padding: '30px', borderRadius: '20px', border: '1px solid #333', height: 'fit-content' },
    listSection: { flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' },
    listCard: { backgroundColor: 'var(--card-dark)', padding: '20px', borderRadius: '20px', border: '1px solid #333' },
    header: { marginBottom: '20px', fontSize: '1.8rem' },
    subHeader: { marginBottom: '15px', color: '#ccc', borderBottom: '1px solid #333', paddingBottom: '10px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#0f0f0f', color: 'white' },
    select: { padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#0f0f0f', color: 'white' },
    addBtn: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary-red)', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
    userRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' },
    deleteBtn: { padding: '5px 10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: 'transparent', color: '#ff4d4d', cursor: 'pointer', fontSize: '0.8rem' }
};

export default AdminDashboard;