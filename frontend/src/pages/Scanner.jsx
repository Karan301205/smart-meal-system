import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scanner } from '@yudiel/react-qr-scanner';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ScannerPage = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // SECURITY: Kick out anyone who is NOT a Staff member
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Access Denied: Please Login as Staff");
            navigate('/');
        }
        // Ideally, you would also decode the token here to check if role === 'staff'
        // but for now, the backend will handle the final rejection.
    }, [navigate]);

    const handleScan = async (detectedCodes) => {
        if (loading || !detectedCodes.length) return;
        
        const rawValue = detectedCodes[0].rawValue;
        if (!rawValue) return;

        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5001/api/qr/validate', 
                { qrToken: rawValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Success Vibration
            if (navigator.vibrate) navigator.vibrate(200);
            
            setScanResult({
                success: true,
                msg: res.data.msg, 
                studentId: res.data.studentId
            });

        } catch (err) {
            // Error Vibration
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
            
            setScanResult({
                success: false,
                msg: err.response?.data?.msg || "Scan Failed"
            });
        }
        
        // Cooldown
        setTimeout(() => {
            setLoading(false);
            setScanResult(null);
        }, 3000);
    };

    return (
        <div style={styles.container}>
            <Navbar />
            <div style={styles.wrapper}>
                <h1 style={styles.title}>Staff <span style={{color: 'var(--primary-red)'}}>Scanner</span></h1>
                
                <div style={styles.cameraBox}>
                    {!loading ? (
                        <Scanner 
                            onScan={handleScan} 
                            styles={{ container: { width: '100%', height: '100%' } }}
                        />
                    ) : (
                        <div style={styles.processing}>Processing...</div>
                    )}
                </div>

                {scanResult && (
                    <div style={{
                        ...styles.resultBox,
                        borderColor: scanResult.success ? '#4CAF50' : 'var(--primary-red)'
                    }}>
                        <h2 style={{color: scanResult.success ? '#4CAF50' : 'var(--primary-red)'}}>
                            {scanResult.success ? '✅ APPROVED' : '❌ DENIED'}
                        </h2>
                        <p style={{fontSize: '1.2rem'}}>{scanResult.msg}</p>
                    </div>
                )}

                <p style={styles.instruction}>Point camera at student's QR Code</p>
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
        position: 'relative', backgroundColor: '#000'
    },
    processing: {
        width: '100%', height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold'
    },
    resultBox: {
        marginTop: '20px', padding: '20px', borderRadius: '15px', borderWidth: '2px',
        borderStyle: 'solid', backgroundColor: 'var(--card-dark)', boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
    },
    instruction: { marginTop: '20px', color: '#666' }
};

export default ScannerPage;