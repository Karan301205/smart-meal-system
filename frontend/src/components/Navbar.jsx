import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    
    useEffect(() => {
        
        const role = localStorage.getItem('role');
        if (role === 'admin') setIsAdmin(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role'); 
        navigate('/');
    };

    return (
        <nav style={styles.nav}>
            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                <h2 style={styles.logo} onClick={() => navigate('/dashboard')}>
                    Smart <span style={{color: 'var(--primary-red)'}}>Meal</span>
                </h2>
                
                {/* ADMIN BUTTON (Only shows if Admin) */}
                {isAdmin && (
                    <button onClick={() => navigate('/admin')} style={styles.adminBtn}>
                        Admin Panel 🛡️
                    </button>
                )}
            </div>

            <button onClick={handleLogout} style={styles.link}>
                Logout
            </button>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 0', marginBottom: '40px', borderBottom: '1px solid #333'
    },
    logo: { fontSize: '1.5rem', cursor: 'pointer' },
    link: {
        background: 'transparent', border: '1px solid #333', color: 'white',
        padding: '8px 20px', borderRadius: '30px', fontSize: '0.9rem'
    },
    adminBtn: {
        background: '#333', color: 'white', border: 'none', padding: '8px 15px',
        borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold'
    }
};

export default Navbar;