import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { patientsAPI } from '../services/api'
import { Edit2, CheckCircle, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const SPECIES_OPTIONS = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'rabbit', label: 'Rabbit' },
    { value: 'hamster', label: 'Hamster' },
    { value: 'guinea_pig', label: 'Guinea Pig' },
    { value: 'fish', label: 'Fish' },
    { value: 'reptile', label: 'Reptile' },
    { value: 'horse', label: 'Horse' },
    { value: 'cow', label: 'Cow' },
    { value: 'goat', label: 'Goat' },
    { value: 'sheep', label: 'Sheep' },
    { value: 'pig', label: 'Pig' },
    { value: 'poultry', label: 'Poultry' },
    { value: 'other', label: 'Other' }
]

export default function PatientEdit() {
    const { patientId } = useParams()
    const navigate = useNavigate()
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        species: 'dog',
        breed: '',
        weight_kg: '',
        age_months: '',
        sex: 'unknown',
        color: '',
        microchip_id: '',
        owner: {
            name: '',
            phone: '',
            email: '',
            address: ''
        }
    })

    const { isLoading, error } = useQuery({
        queryKey: ['clinical-patient', patientId],
        queryFn: async () => {
            const res = await patientsAPI.get(patientId)
            const data = res.data
            setFormData({
                name: data.name || '',
                species: data.species || 'dog',
                breed: data.breed || '',
                weight_kg: data.weight_kg || '',
                age_months: data.age_months !== undefined ? data.age_months : (data.age ? data.age * 12 : ''),
                sex: data.sex || data.gender || 'unknown',
                color: data.color || '',
                microchip_id: data.microchip_id || '',
                owner: {
                    name: data.owner?.name || data.owner_name || '',
                    phone: data.owner?.phone || data.owner_contact || '',
                    email: data.owner?.email || '',
                    address: data.owner?.address || ''
                }
            })
            return data
        }
    })

    const updateMutation = useMutation({
        mutationFn: (data) => patientsAPI.update(patientId, data),
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => {
                navigate(`/patients/${patientId}`)
            }, 1000)
        }
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        if (name.startsWith('owner.')) {
            const field = name.split('.')[1]
            setFormData(prev => ({
                ...prev,
                owner: { ...prev.owner, [field]: value }
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            weight_kg: parseFloat(formData.weight_kg),
            age_months: parseInt(formData.age_months)
        }

        updateMutation.mutate(submitData)
    }

    if (isLoading) return <LoadingSpinner fullScreen />
    if (error) return <div className="alert alert-error">Failed to load patient data</div>

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Edit Patient</h1>
                    <p className="page-subtitle">Update information for {formData.name}</p>
                </div>
            </div>

            <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
                <div className="card-header">
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Edit2 size={20} />
                        Update Patient Information
                    </h3>
                </div>
                <div className="card-body">
                    {success && (
                        <div className="alert alert-success" style={{ marginBottom: 'var(--space-6)' }}>
                            <CheckCircle size={18} />
                            Patient updated successfully! Redirecting...
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        {/* Pet Information */}
                        <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-200)' }}>
                            Pet Details
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Pet Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Max"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Species *</label>
                                <select
                                    name="species"
                                    value={formData.species}
                                    onChange={handleChange}
                                    className="form-input form-select"
                                    required
                                >
                                    {SPECIES_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Breed</label>
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Golden Retriever"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Sex</label>
                                <select
                                    name="sex"
                                    value={formData.sex}
                                    onChange={handleChange}
                                    className="form-input form-select"
                                >
                                    <option value="unknown">Unknown</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Weight (kg) *</label>
                                <input
                                    type="number"
                                    name="weight_kg"
                                    value={formData.weight_kg}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 15.5"
                                    step="0.1"
                                    min="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Age (months) *</label>
                                <input
                                    type="number"
                                    name="age_months"
                                    value={formData.age_months}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 24"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Golden"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Microchip ID</label>
                                <input
                                    type="text"
                                    name="microchip_id"
                                    value={formData.microchip_id}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        {/* Owner Information */}
                        <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', marginTop: 'var(--space-6)', paddingBottom: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-200)' }}>
                            Owner Details
                        </h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="form-label">Owner Name *</label>
                                <input
                                    type="text"
                                    name="owner.name"
                                    value={formData.owner.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., John Smith"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="owner.phone"
                                    value={formData.owner.phone}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., +1234567890"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="owner.email"
                                    value={formData.owner.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    name="owner.address"
                                    value={formData.owner.address}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        {updateMutation.isError && (
                            <div className="alert alert-error" style={{ marginTop: 'var(--space-4)' }}>
                                <AlertCircle size={18} />
                                <span>Failed to update patient</span>
                            </div>
                        )}

                        <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={updateMutation.isPending}
                            >
                                {updateMutation.isPending ? (
                                    <span className="loading-spinner" style={{ width: 18, height: 18 }}></span>
                                ) : (
                                    <>
                                        <Edit2 size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary btn-lg"
                                onClick={() => navigate(`/patients/${patientId}`)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
