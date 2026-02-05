import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav style={styles.nav}>
            <h2 style={styles.logo}>Smart <span style={{color: 'var(--primary-red)'}}>Meal</span></h2>
            <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }} style={styles.link}>
                Logout
            </button>
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        marginBottom: '40px'
    },
    logo: { fontSize: '1.5rem' },
    link: {
        background: 'transparent',
        border: '1px solid #333',
        color: 'white',
        padding: '8px 20px',
        borderRadius: '30px',
        fontSize: '0.9rem'
    }
};

export default Navbar;