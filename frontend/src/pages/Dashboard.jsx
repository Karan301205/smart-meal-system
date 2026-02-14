import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import QRCode from 'react-qr-code';

const Dashboard = () => {
    const [menu, setMenu] = useState([]);
    const [qrCode, setQrCode] = useState('');
    const [showQrModal, setShowQrModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // Timer State

    useEffect(() => {
        // Fetch Menu logic... (Keep existing code)
        const fetchMenu = async () => {
            try {
                const res = await axios.get('https://smart-meal-system.onrender.com/api/menu');
                setMenu(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMenu();
    }, []);

    // Timer Logic
    useEffect(() => {
        let timer;
        if (showQrModal && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setShowQrModal(false); // Close modal when time is up
        }
        return () => clearInterval(timer);
    }, [showQrModal, timeLeft]);

    const generateQR = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://smart-meal-system.onrender.com/api/qr/generate', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQrCode(res.data.qrData);
            setTimeLeft(60); // Reset timer to 60s
            setShowQrModal(true);
        } catch (err) { alert("Failed to generate QR"); }
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.wrapper}>
                <div style={styles.hero}>
                    <h1>Today's <span style={{ color: 'var(--primary-red)' }}>Menu</span></h1>
                    <button onClick={generateQR} style={styles.mainBtn}>Get Meal Pass 🎟️</button>
                </div>

                {/* Keep your existing Menu Grid code here... */}
                <div style={styles.grid}>
                    {/* ... (Keep your menu mapping code exactly as it was) ... */}
                    {menu.map((m, index) => (
                        <div key={index} style={styles.card}>
                            <h3 style={styles.cardTitle}>{m.category}</h3>
                            <p style={styles.cardDesc}>{m.items.join(', ')}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* NEW QR MODAL WITH TIMER */}
            {showQrModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={{ color: 'black', marginBottom: '10px' }}>Scan Now</h2>
                        <QRCode value={qrCode} size={200} />

                        {/* THE TIMER */}
                        <div style={styles.timerBox}>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: timeLeft < 10 ? 'red' : 'green' }}>
                                00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Valid for 1 min</p>
                        </div>

                        <button onClick={() => setShowQrModal(false)} style={styles.closeBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    // ... Keep your existing styles ...
    container: { minHeight: '100vh', padding: '20px' },
    wrapper: { maxWidth: '1200px', margin: '0 auto' },
    hero: { textAlign: 'center', marginBottom: '50px' },
    mainBtn: { marginTop: '20px', padding: '15px 40px', fontSize: '1rem', borderRadius: '50px', backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' },
    card: { backgroundColor: 'var(--card-dark)', borderRadius: '30px', padding: '30px', textAlign: 'center', border: '1px solid #333' },
    cardTitle: { fontSize: '1.4rem', marginBottom: '10px', color: 'white' },
    cardDesc: { color: '#a3a3a3' },

    // Timer Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '40px', borderRadius: '20px', textAlign: 'center', width: '90%', maxWidth: '350px' },
    timerBox: { marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '10px' },
    closeBtn: { marginTop: '20px', background: '#333', color: 'white', padding: '10px 20px', borderRadius: '20px', border: 'none' }
};

export default Dashboard;