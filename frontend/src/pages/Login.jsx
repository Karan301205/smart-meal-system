import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = await axios.post('https://smart-meal-system.onrender.com/api/auth/login', formData);
            
            // 1. Save Token & Role
            const { token, role } = res.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // 2. Auto-Redirect based on Role
            if (role === 'admin') {
                navigate('/admin');       // Admin -> Dashboard
            } else if (role === 'staff') {
                navigate('/scan');        // Staff -> Scanner
            } else {
                navigate('/dashboard');   // Students/Guests -> Menu
            }

        } catch (err) {
            setError('Invalid Credentials');
            console.error(err);
        }
    };

    return (
        <div style={styles.container}>
            {/* Left Side: Text/Brand */}
            <div style={styles.content}>
                <h1 style={styles.brand}>Smart <span style={{color: 'var(--primary-red)'}}>Meal</span></h1>
                <h2 style={styles.headline}>It’s not just Food, <br/> It’s an Experience.</h2>
                
                <div style={styles.loginCard}>
                    {error && <p style={styles.error}>{error}</p>}
                    
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="student@college.edu"
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="••••••••"
                                required 
                            />
                        </div>
                        <button type="submit" style={styles.button}>Sign In</button>
                    </form>
                </div>
            </div>
            
            {/* Decorative Circle (Abstract Food Vibe) */}
            <div style={styles.circleDecoration}></div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px'
    },
    content: {
        zIndex: 2,
        maxWidth: '500px',
        width: '100%'
    },
    brand: {
        fontSize: '1.5rem',
        marginBottom: '20px',
        letterSpacing: '1px'
    },
    headline: {
        fontSize: '3rem',
        lineHeight: '1.2',
        marginBottom: '40px',
        background: '-webkit-linear-gradient(45deg, #fff, #aaa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    },
    loginCard: {
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        padding: '30px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid #333'
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '0.9rem', color: '#a3a3a3' },
    input: {
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid #333',
        backgroundColor: '#0f0f0f',
        color: 'white',
        fontSize: '1rem',
        outline: 'none'
    },
    button: {
        padding: '15px',
        borderRadius: '50px', 
        border: 'none',
        backgroundColor: 'var(--primary-red)',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginTop: '10px',
        boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)'
    },
    error: { color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '10px' },
    circleDecoration: {
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(229,9,20,0.1) 0%, rgba(0,0,0,0) 70%)',
        zIndex: 1
    }
};

export default Login;