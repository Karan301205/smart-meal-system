import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ScannerPage = () => {
    const navigate = useNavigate();
    const [scannedUser, setScannedUser] = useState(null); // Stores the student info
    const [loading, setLoading] = useState(false); // Controls camera pause

    // Security Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Access Denied: Please Login as Staff");
            navigate('/');
        }
    }, [navigate]);

    // Step 1: Scan and Fetch Info (Peek)
    const handleScan = async (detectedCodes) => {
        if (loading || !detectedCodes.length) return;
        
        const rawValue = detectedCodes[0].rawValue;
        if (!rawValue) return;

        setLoading(true); // Pause Scanner
        
        try {
            const token = localStorage.getItem('token');
            // Call the new "Peek" endpoint
            const res = await axios.post('http://localhost:5001/api/qr/scan-info', 
                { qrToken: rawValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Show Confirmation Modal
            setScannedUser({
                ...res.data, // name, role, mealsLeft
                token: rawValue // Keep token to send later
            });

        } catch (err) {
            console.error(err); // Prints full error to Console
            // Show the REAL error message from the backend
            alert(err.response?.data?.msg || err.message || "Unknown Error");
            setLoading(false);
        }
    };

    // Step 2: Confirm Meal (Staff clicks YES)
    const confirmMeal = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/qr/validate', 
                { qrToken: scannedUser.token },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            alert(res.data.msg); // "Meal Served!"
            setScannedUser(null);
            setLoading(false); // Restart Scanner
        } catch (err) {
            alert(err.response?.data?.msg || "Error serving meal");
            setScannedUser(null);
            setLoading(false);
        }
    };

    // Cancel (Staff clicks NO)
    const cancelScan = () => {
        setScannedUser(null);
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.wrapper}>
                <h1 style={styles.title}>Staff <span style={{color: 'var(--primary-red)'}}>Scanner</span></h1>
                
                {/* CAMERA AREA */}
                {!scannedUser && (
                    <div style={styles.cameraBox}>
                        <Scanner 
                            onScan={handleScan} 
                            styles={{ container: { width: '100%', height: '100%' } }}
                        />
                        <p style={{marginTop:'10px', color:'#fff'}}>Scanning active...</p>
                    </div>
                )}

                {/* CONFIRMATION CARD (Replaces Camera when scanned) */}
                {scannedUser && (
                    <div style={styles.confirmCard}>
                        <h2 style={{color:'black', marginBottom:'10px'}}>Verify Student</h2>
                        
                        <div style={styles.infoRow}>
                            <span>Name:</span> 
                            <strong>{scannedUser.name}</strong>
                        </div>
                        
                        <div style={styles.infoRow}>
                            <span>Type:</span> 
                            <span style={{
                                backgroundColor: scannedUser.role === 'guest' ? '#FF9800' : '#4CAF50',
                                color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize:'0.9rem'
                            }}>
                                {scannedUser.role === 'guest' ? 'GUEST USER' : 'COLLEGE STUDENT'}
                            </span>
                        </div>

                        {scannedUser.role === 'guest' && (
                            <div style={styles.infoRow}>
                                <span>Meals Left:</span>
                                <strong style={{color:'red'}}>{scannedUser.mealsLeft}</strong>
                            </div>
                        )}

                        <div style={styles.actionBox}>
                            <p style={{marginBottom:'15px', fontWeight:'bold'}}>Serve Meal?</p>
                            <div style={{display:'flex', gap:'10px', justifyContent:'center'}}>
                                <button onClick={confirmMeal} style={styles.yesBtn}>✅ YES, SERVE</button>
                                <button onClick={cancelScan} style={styles.noBtn}>❌ NO</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { minHeight: '100vh', padding: '20px', textAlign: 'center' },
    wrapper: { maxWidth: '600px', margin: '0 auto' },
    title: { marginBottom: '30px' },
    cameraBox: {
        width: '100%', maxWidth: '400px', height: '400px', margin: '0 auto',
        border: '4px solid #333', borderRadius: '20px', overflow: 'hidden',
        backgroundColor: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center'
    },
    confirmCard: {
        backgroundColor: 'white', padding: '30px', borderRadius: '20px',
        color: 'black', maxWidth: '400px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    },
    infoRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 0', borderBottom: '1px solid #eee'
    },
    actionBox: { marginTop: '20px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '10px' },
    yesBtn: {
        padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    },
    noBtn: {
        padding: '10px 20px', backgroundColor: '#f44336', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
    }
};

export default ScannerPage;