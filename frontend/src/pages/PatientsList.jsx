import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { patientsAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { Search, User, Filter, PawPrint, ChevronRight } from 'lucide-react'

export default function PatientsList() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

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

    useEffect(() => {
        fetchPatients()
    }, [])

    const fetchPatients = async () => {
        try {
            setLoading(true)
            const response = await patientsAPI.list()
            setPatients(response.data)
        } catch (err) {
            console.error('Error fetching patients:', err)
            setError('Failed to load patient records.')
        } finally {
            setLoading(false)
        }
    }

    const filteredPatients = patients.filter(p => {
        const ownerName = p.owner?.name || p.owner_name || '';
        return p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.species?.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const getInitial = (name) => name ? name.charAt(0).toUpperCase() : <PawPrint size={16} />

    const getAvatarColor = (name) => {
        const colors = [
            { bg: '#ebdcd3', text: '#896a58' }, // Primary
            { bg: '#d9d8d5', text: '#567257' }, // Neutral / Green
            { bg: '#fef3c7', text: '#d97706' }, // Warm yellow/orange
            { bg: '#e2e8f0', text: '#475569' }, // Cool gray
            { bg: '#dcfce7', text: '#166534' }, // Green
        ]
        if (!name) return colors[0]
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div className="loading-spinner" style={{ width: 40, height: 40, borderTopColor: 'var(--color-primary-500)' }}></div>
        </div>
    )

    return (
        <div>
            <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
                <div>
                    <h1 className="page-title" style={{ color: 'var(--color-primary-800)', fontSize: '2rem', fontWeight: 800 }}>Patient Directory</h1>
                    <p className="page-subtitle" style={{ color: 'var(--color-gray-500)', fontSize: '1.05rem', marginTop: 'var(--space-2)' }}>View and manage all registered patient records.</p>
                </div>
            </div>

            {error && (
                <div className="alert alert-error mb-6" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    {error}
                </div>
            )}

            <div className="card mb-6" style={{ background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
                <div className="card-body" style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: 'var(--space-4) var(--space-6)' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                        <input
                            type="text"
                            placeholder="Search patients by name, owner, or species..."
                            className="input-field"
                            style={{ 
                                paddingLeft: '48px', 
                                width: '100%', 
                                padding: 'var(--space-3) var(--space-4) var(--space-3) 48px',
                                border: '1.5px solid var(--color-gray-200)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: '1rem',
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = 'var(--color-primary-500)'}
                            onBlur={e => e.target.style.borderColor = 'var(--color-gray-200)'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary" style={{ padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, background: 'var(--color-gray-100)', color: 'var(--color-gray-700)', border: 'none', transition: 'all 0.2s' }}>
                        <Filter size={18} />
                        Filter
                    </button>
                </div>
            </div>

            <div className="card" style={{ background: 'white', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="table-container" style={{ margin: 0, padding: 0 }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--color-gray-50)', borderBottom: '2px solid var(--color-gray-200)' }}>
                                <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Patient Name</th>
                                <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Species/Breed</th>
                                <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Owner Details</th>
                                <th style={{ padding: 'var(--space-4) var(--space-6)', color: 'var(--color-gray-500)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left' }}>Age/Gender</th>
                                <th style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                                        <div style={{ width: 64, height: 64, background: 'var(--color-gray-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
                                            <User size={32} style={{ color: 'var(--color-gray-400)' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-gray-800)', marginBottom: 'var(--space-2)' }}>No patients found</h3>
                                        <p style={{ color: 'var(--color-gray-500)' }}>{searchQuery ? "We couldn't find any patients matching your search." : "No patient records exist yet."}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient, index) => {
                                    const avatar = getAvatarColor(patient.name)
                                    const patientId = patient.id || patient._id || patient.microchip_id || String(index);
                                    const displayId = patientId.length > 6 ? String(patientId).slice(-6).toUpperCase() : String(patientId).toUpperCase();
                                    
                                    const ownerName = patient.owner?.name || patient.owner_name || 'Unknown';
                                    const ownerContact = patient.owner?.phone || patient.owner_contact || 'No contact info';
                                    
                                    let ageDisplay = 'N/A';
                                    if (patient.age_months !== undefined) {
                                        ageDisplay = patient.age_months >= 12 
                                            ? `${Math.floor(patient.age_months / 12)} yrs ${patient.age_months % 12 > 0 ? (patient.age_months % 12) + ' mo' : ''}` 
                                            : `${patient.age_months} mo`;
                                    } else if (patient.age !== undefined) {
                                        ageDisplay = `${patient.age} yrs`;
                                    }
                                    
                                    const genderDisplay = patient.sex || patient.gender || 'N/A';

                                    return (
                                        <tr key={patientId} onClick={() => navigate(`/patients/${patientId}`)} style={{ borderBottom: '1px solid var(--color-gray-100)', transition: 'background-color 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-gray-50)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{
                                                        width: 48, height: 48, borderRadius: '50%',
                                                        backgroundColor: avatar.bg, color: avatar.text,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1.75rem', fontWeight: 700,
                                                        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                                                    }}>
                                                        {getSpeciesIcon(patient.species)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--color-gray-900)' }}>{patient.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <PawPrint size={12} /> Patient ID: {displayId}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                                <div style={{ fontWeight: 500, color: 'var(--color-gray-800)', textTransform: 'capitalize' }}>{patient.species}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: '2px' }}>{patient.breed || 'Unknown breed'}</div>
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                                <div style={{ fontWeight: 500, color: 'var(--color-gray-800)' }}>{ownerName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: '2px' }}>{ownerContact}</div>
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)' }}>
                                                <div style={{ fontWeight: 500, color: 'var(--color-gray-800)' }}>{ageDisplay}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-500)', marginTop: '2px', textTransform: 'capitalize' }}>{genderDisplay}</div>
                                            </td>
                                            <td style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'right' }}>
                                                <button style={{ background: 'transparent', border: 'none', color: 'var(--color-gray-400)', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-primary-500)'; e.currentTarget.style.background = 'var(--color-primary-50)' }} onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-gray-400)'; e.currentTarget.style.background = 'transparent' }}>
                                                    <ChevronRight size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
