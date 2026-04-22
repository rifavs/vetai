import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientsAPI, diagnosisAPI } from '../services/api';
import { ArrowLeft, User, Phone, MapPin, Mail, Activity, AlertCircle, FileText, ActivitySquare, Plus, Edit2, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PatientDetails() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diagnoses, setDiagnoses] = useState([]);

    useEffect(() => {
        fetchPatientData();
        fetchDiagnoses();
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

    const fetchDiagnoses = async () => {
        try {
            const response = await diagnosisAPI.patientDiagnoses(patientId);
            setDiagnoses(response.data || []);
        } catch (err) {
            console.error('Error fetching diagnoses:', err);
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
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--color-gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
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

                    {/* Medical Summary Card */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: 'var(--color-gray-800)' }}>
                                <ActivitySquare size={20} style={{ color: 'var(--color-primary-600)' }} /> Medical Summary
                            </h3>
                        </div>

                        {/* Allergies & History */}
                        <div style={{ padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', borderBottom: '1px solid var(--color-gray-100)' }}>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <AlertCircle size={16} color="var(--color-amber-500)" /> Allergies
                                </h4>
                                {patient.allergies && patient.allergies.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {patient.allergies.map((a, i) => (
                                            <span key={i} style={{ background: 'var(--color-amber-50)', color: 'var(--color-amber-700)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 500 }}>{a}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>No known allergies</div>
                                )}
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileText size={16} style={{ color: 'var(--color-primary-500)' }} /> Medical History
                                </h4>
                                {patient.medical_history && patient.medical_history.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--color-gray-700)', fontSize: '0.95rem' }}>
                                        {patient.medical_history.map((item, i) => <li key={i} style={{ marginBottom: '4px' }}>{item}</li>)}
                                    </ul>
                                ) : (
                                    <div style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>No medical history recorded</div>
                                )}
                            </div>
                        </div>

                        {/* Diagnoses — auto-populated after every AI Diagnosis run */}
                        <div style={{ padding: 'var(--space-4) var(--space-6) var(--space-6)' }}>
                            <h4 style={{ fontSize: '1rem', color: 'var(--color-gray-800)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={18} style={{ color: 'var(--color-primary-500)' }} />
                                Diagnoses &amp; Clinical Records
                                {diagnoses.length > 0 && (
                                    <span style={{ marginLeft: 6, background: 'var(--color-primary-100)', color: 'var(--color-primary-700)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px' }}>
                                        {diagnoses.length}
                                    </span>
                                )}
                            </h4>

                            {diagnoses.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {diagnoses.map((diag) => {
                                        const id = diag._id || diag.id;
                                        const topDisease = diag.final_diagnosis
                                            || diag.top_prediction?.disease_name
                                            || diag.predictions?.[0]?.disease_name
                                            || 'Prediction Recorded';
                                        const isFinalized = !!diag.final_diagnosis;
                                        const confidencePct = diag.confidence_score != null ? Math.round(diag.confidence_score * 100) : null;
                                        const symptoms = diag.top_prediction?.matched_symptoms || diag.predictions?.[0]?.matched_symptoms || [];
                                        const date = diag.created_at
                                            ? new Date(diag.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : '—';

                                        return (
                                            <div key={id} style={{
                                                border: isFinalized ? '1.5px solid #6ee7b7' : '1px solid var(--color-gray-200)',
                                                borderRadius: 'var(--radius-lg)',
                                                background: isFinalized ? '#f0fdf4' : 'var(--color-gray-50)',
                                                padding: 'var(--space-4)',
                                                boxShadow: isFinalized ? '0 2px 8px rgba(5,150,105,0.08)' : 'none'
                                            }}>
                                                {/* Header row */}
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: symptoms.length > 0 ? 'var(--space-3)' : 0 }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: isFinalized ? '#065f46' : 'var(--color-gray-900)', fontSize: '1rem', textTransform: 'capitalize' }}>
                                                            {isFinalized && <CheckCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle', color: '#059669' }} />}
                                                            {topDisease}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: 'var(--color-gray-500)', marginTop: '3px' }}>
                                                            {isFinalized
                                                                ? <span style={{ color: '#059669', fontWeight: 600 }}>Doctor Confirmed</span>
                                                                : <span>AI Prediction</span>
                                                            }
                                                            <span style={{ margin: '0 5px' }}>·</span>{date}
                                                        </div>
                                                    </div>
                                                    {confidencePct !== null && (
                                                        <span style={{
                                                            padding: '3px 10px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0,
                                                            background: confidencePct >= 70 ? '#dcfce7' : confidencePct >= 40 ? '#fef9c3' : '#fee2e2',
                                                            color: confidencePct >= 70 ? '#166534' : confidencePct >= 40 ? '#854d0e' : '#991b1b',
                                                        }}>
                                                            {confidencePct}% confidence
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Matched symptoms */}
                                                {symptoms.length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: diag.predictions?.length > 1 ? 'var(--space-2)' : 0 }}>
                                                        {symptoms.slice(0, 6).map((s, si) => (
                                                            <span key={si} style={{ padding: '2px 10px', borderRadius: '100px', background: '#dcfce7', color: '#166534', fontSize: '0.78rem', fontWeight: 500 }}>✓ {s}</span>
                                                        ))}
                                                        {symptoms.length > 6 && (
                                                            <span style={{ padding: '2px 10px', borderRadius: '100px', background: 'var(--color-gray-200)', color: 'var(--color-gray-600)', fontSize: '0.78rem' }}>+{symptoms.length - 6} more</span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Other predictions */}
                                                {diag.predictions && diag.predictions.length > 1 && (
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                                                        {diag.predictions.map((pred, pi) => {
                                                            const pct = pred.symptom_confidence != null ? pred.symptom_confidence : Math.round((pred.probability || 0) * 100);
                                                            const isTop = diag.final_diagnosis === pred.disease_name;
                                                            return (
                                                                <span key={pi} style={{
                                                                    padding: '2px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: isTop ? 700 : 400,
                                                                    border: isTop ? '1px solid #6ee7b7' : '1px solid var(--color-gray-200)',
                                                                    background: isTop ? '#ecfdf5' : 'white',
                                                                    color: isTop ? '#065f46' : 'var(--color-gray-600)', textTransform: 'capitalize'
                                                                }}>
                                                                    {pred.disease_name} — {pct}%
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {diag.ai_notes && (
                                                    <div style={{ marginTop: 'var(--space-2)', fontSize: '0.75rem', color: 'var(--color-gray-400)', fontStyle: 'italic' }}>{diag.ai_notes}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', border: '2px dashed var(--color-gray-200)', borderRadius: 'var(--radius-lg)', background: 'var(--color-gray-50)' }}>
                                    <FileText size={32} style={{ color: 'var(--color-gray-300)', marginBottom: '10px' }} />
                                    <div style={{ fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '6px' }}>No diagnoses yet</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-400)', marginBottom: 'var(--space-4)' }}>
                                        Run an AI diagnosis — results will appear here automatically.
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                        onClick={() => navigate('/diagnosis', { state: { patientId: patient.id || patient._id } })}
                                    >
                                        <Plus size={16} /> Run AI Diagnosis
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {/* Owner Card */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: 'var(--color-gray-800)' }}>
                                <User size={20} style={{ color: 'var(--color-primary-600)' }} /> Owner Details
                            </h3>
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

                    {/* Quick Action */}
                    <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)', padding: 'var(--space-4)' }}>
                        <button
                            onClick={() => navigate('/diagnosis', { state: { patientId: patient.id || patient._id } })}
                            className="btn btn-primary"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                        >
                            <Plus size={18} /> Run AI Diagnosis
                        </button>
                        {diagnoses.length > 0 && (
                            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>
                                {diagnoses.length} diagnosis record{diagnoses.length !== 1 ? 's' : ''} on file
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
