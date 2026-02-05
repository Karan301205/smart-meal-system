import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import QRCode from 'react-qr-code';

const Dashboard = () => {
    const [menu, setMenu] = useState([]);
    const [qrCode, setQrCode] = useState('');
    const [showQrModal, setShowQrModal] = useState(false);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/menu');
                setMenu(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMenu();
    }, []);

    const generateQR = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/qr/generate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrCode(res.data.qrData);
            setShowQrModal(true);
        } catch (err) { alert("Failed to generate QR"); }
    };

    return (
        <div style={styles.container}>
            <div style={styles.wrapper}>
                <Navbar />
                
                {/* Hero Section */}
                <div style={styles.hero}>
                    <h1>Today's <span style={{color: 'var(--primary-red)'}}>Menu</span></h1>
                    <button onClick={generateQR} style={styles.mainBtn}>
                        Get Meal Pass 🎟️
                    </button>
                </div>

                {/* Menu Grid (Matches the "Ravioli" cards) */}
                <div style={styles.grid}>
                    {menu.length === 0 ? <p style={{color: '#666'}}>Menu loading...</p> : menu.map((m, index) => (
                        <div key={index} style={styles.card}>
                            {/* Placeholder Food Image Circle */}
                            <div style={styles.imagePlaceholder}>🍽️</div>
                            
                            <h3 style={styles.cardTitle}>{m.category}</h3>
                            <p style={styles.cardDesc}>{m.items.join(', ')}</p>
                            
                            <div style={styles.cardFooter}>
                                <span style={styles.price}>Included</span>
                                <button style={styles.iconBtn} onClick={generateQR}>➜</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QR Code Modal (Popup) */}
            {showQrModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={{color: 'black', marginBottom:'10px'}}>Scan Now</h2>
                        <QRCode value={qrCode} size={200} />
                        <p style={{color: 'red', marginTop:'10px', fontSize:'0.8rem'}}>Valid for 30s</p>
                        <button onClick={() => setShowQrModal(false)} style={styles.closeBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', padding: '20px' },
    wrapper: { maxWidth: '1200px', margin: '0 auto' },
    hero: { textAlign: 'center', marginBottom: '50px' },
    mainBtn: {
        marginTop: '20px', padding: '15px 40px', fontSize: '1rem', borderRadius: '50px',
        backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', fontWeight: 'bold'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive Grid
        gap: '30px'
    },
    card: {
        backgroundColor: 'var(--card-dark)',
        borderRadius: '30px',
        padding: '30px',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid #333'
    },
    imagePlaceholder: {
        width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#2a2a2a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
        margin: '0 auto 20px auto', boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
    },
    cardTitle: { fontSize: '1.4rem', marginBottom: '10px' },
    cardDesc: { color: 'var(--text-gray)', fontSize: '0.9rem', marginBottom: '20px', minHeight: '40px' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
    price: { fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-red)' },
    iconBtn: {
        width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-red)',
        color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    },
    modal: { backgroundColor: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center' },
    closeBtn: { marginTop: '20px', background: '#333', color: 'white', padding: '10px 20px', borderRadius: '20px', border: 'none' }
};

export default Dashboard;