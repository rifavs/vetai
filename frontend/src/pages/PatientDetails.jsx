import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientsAPI, clinicalAPI } from '../services/api';
import { ArrowLeft, User, Phone, MapPin, Mail, Calendar, Activity, AlertCircle, FileText, ActivitySquare, Plus, Edit2, PawPrint, Trash2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PatientDetails() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clinicalRecords, setClinicalRecords] = useState([]);

    useEffect(() => {
        fetchPatientData();
        fetchClinicalRecords();
    }, [patientId]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await patientsAPI.get(patientId);
            setPatient(response.data);
        } catch (err) {
            console.error('Error fetching patient details:', err);
            setError('Failed to load patient details.');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchClinicalRecords = async () => {
        try {
            const response = await clinicalAPI.patientRecords(patientId);
            setClinicalRecords(response.data);
        } catch (err) {
            console.error('Error fetching clinical records:', err);
        }
    };

    const handleDeleteRecord = async (recordId) => {
        if (!window.confirm('Are you sure you want to delete this clinical record?')) return;
        try {
            await clinicalAPI.deleteRecord(recordId);
            setClinicalRecords(prev => prev.filter(r => r.id !== recordId && r._id !== recordId));
        } catch (err) {
            console.error('Error deleting record:', err);
            alert('Failed to delete the record.');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    if (error || !patient) return (
        <div style={{ padding: 'var(--space-6)' }}>
            <div className="alert alert-error">{error || 'Patient not found.'}</div>
            <button onClick={() => navigate('/patients')} className="btn btn-primary mt-4">Back to Patients</button>
        </div>
    );

    const getSpeciesIcon = (species) => {
        const s = (species || '').toLowerCase();
        if (s.includes('dog')) return '🐶';
        if (s.includes('cat')) return '🐱';
        if (s.includes('bird') || s.includes('parrot') || s.includes('poultry')) return '🐦';
        if (s.includes('rabbit') || s.includes('bunny')) return '🐰';
        if (s.includes('hamster') || s.includes('guinea')) return '🐹';
        if (s.includes('fish')) return '🐟';
        if (s.includes('reptile') || s.includes('snake') || s.includes('lizard') || s.includes('turtle')) return '🐢';
        if (s.includes('horse') || s.includes('equine')) return '🐴';
        if (s.includes('cow') || s.includes('bovine')) return '🐮';
        if (s.includes('goat')) return '🐐';
        if (s.includes('sheep')) return '🐑';
        if (s.includes('pig') || s.includes('swine')) return '🐷';
        return '🐾';
    };

    const displayAge = patient.age_months !== undefined 
        ? (patient.age_months >= 12 ? `${Math.floor(patient.age_months / 12)} yrs ${patient.age_months % 12 > 0 ? (patient.age_months % 12) + ' mo' : ''}` : `${patient.age_months} mo`)
        : (patient.age ? `${patient.age} yrs` : 'N/A');

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 'var(--space-8)' }}>
            {/* Header section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-6)' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }} className="hover-bg-gray-100">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="page-title" style={{ margin: 0 }}>Patient Profile</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-6)' }}>
                
                {/* Main Content Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Patient Overview Card */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
                            <div style={{ width: 100, height: 100, borderRadius: '20px', backgroundColor: 'var(--color-primary-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }}>
                                {getSpeciesIcon(patient.species)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gray-900)', margin: '0 0 var(--space-1) 0' }}>{patient.name}</h2>
                                        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', color: 'var(--color-gray-500)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
                                            <span style={{ background: 'var(--color-gray-100)', padding: '4px 10px', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--color-gray-700)' }}>{(patient.id || patient._id)?.slice(-6).toUpperCase()}</span>
                                            {patient.microchip_id && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Activity size={12} /> Microchip: {patient.microchip_id}</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => navigate(`/patients/${patient.id || patient._id}/edit`)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--radius-lg)' }}>
                                        <Edit2 size={16} /> Edit
                                    </button>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Species</div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-gray-900)', textTransform: 'capitalize' }}>{patient.species}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Breed</div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-gray-900)' }}>{patient.breed || 'Unknown'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Age</div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-gray-900)' }}>{displayAge}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', fontWeight: 600, textTransform: 'uppercase' }}>Weight / Sex</div>
                                        <div style={{ fontWeight: 500, color: 'var(--color-gray-900)' }}>{patient.weight_kg ? `${patient.weight_kg} kg` : '--'} / <span style={{ textTransform: 'capitalize' }}>{patient.sex || patient.gender || '--'}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: 'var(--color-gray-800)' }}><ActivitySquare size={20} style={{ color: 'var(--color-primary-600)' }} /> Medical Summary</h3>
                        </div>
                        <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={16} color="var(--color-amber-500)" /> Allergies</h4>
                                {patient.allergies && patient.allergies.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {patient.allergies.map((allergy, i) => (
                                            <span key={i} style={{ background: 'var(--color-amber-50)', color: 'var(--color-amber-700)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 500 }}>{allergy}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>No known allergies</div>
                                )}
                            </div>
                            
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}><FileText size={16} style={{ color: 'var(--color-primary-500)' }} /> Medical History</h4>
                                {patient.medical_history && patient.medical_history.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-gray-700)', fontSize: '0.95rem' }}>
                                        {patient.medical_history.map((item, i) => (
                                            <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>No medical history recorded</div>
                                )}
                            </div>
                        </div>
                        <div style={{ padding: '0 var(--space-6) var(--space-6) var(--space-6)' }}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--color-gray-800)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--color-gray-200)', paddingTop: 'var(--space-4)' }}>
                                <FileText size={18} style={{ color: 'var(--color-primary-500)' }} /> Diagnoses & Clinical Records
                            </h4>
                            {clinicalRecords?.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {clinicalRecords.map((record) => (
                                        <div key={record._id || record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 'var(--space-3)', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', background: 'var(--color-gray-50)' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--color-gray-900)' }}>
                                                    {record.extracted_features?.final_diagnosis || 'Clinical Record'}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                                                    Date: {new Date(record.created_at || new Date()).toLocaleDateString()}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-600)', marginTop: '4px' }}>
                                                    <strong>Symptoms:</strong> {record.clinical_input?.symptoms?.join(', ') || 'None recorded'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => navigate(`/diagnosis/${record.id || record._id}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary-600)' }} title="Edit"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteRecord(record.id || record._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error-500)' }} title="Delete"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>No clinical records available</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Owner Card */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: 'var(--color-gray-800)' }}><User size={20} style={{ color: 'var(--color-primary-600)' }} /> Owner Details</h3>
                        </div>
                        <div style={{ padding: 'var(--space-6)' }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-gray-900)', marginBottom: 'var(--space-4)' }}>
                                {patient.owner?.name || patient.owner_name || 'Unknown Owner'}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Phone size={16} style={{ color: 'var(--color-gray-400)', marginTop: '2px' }} />
                                    <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem' }}>{patient.owner?.phone || patient.owner_contact || 'No phone provided'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <Mail size={16} style={{ color: 'var(--color-gray-400)', marginTop: '2px' }} />
                                    <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem' }}>{patient.owner?.email || 'No email provided'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <MapPin size={16} style={{ color: 'var(--color-gray-400)', marginTop: '2px' }} />
                                    <span style={{ color: 'var(--color-gray-700)', fontSize: '0.95rem', lineHeight: 1.4 }}>{patient.owner?.address || 'No address provided'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)' }}>
                        <button onClick={() => navigate('/diagnosis', { state: { patientId: patient.id || patient._id } })} className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}>
                            <Plus size={18} /> Add Clinical Record
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
