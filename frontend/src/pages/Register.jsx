import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PawPrint, Stethoscope, ClipboardList, User, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Register() {
    const [activeRole, setActiveRole] = useState('staff')
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        role: 'staff'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { register, login } = useAuth()
    const navigate = useNavigate()

    const handleRoleSwitch = (role) => {
        setActiveRole(role)
        setFormData({ ...formData, role })
        setError('')
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const result = await register({ ...formData, role: activeRole })
            if (result.success) {
                // Auto-login after successful registration
                const loginResult = await login(formData.email, formData.password)
                if (loginResult.success) {
                    navigate('/dashboard')
                } else {
                    navigate('/login')
                }
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const roleTitle = activeRole === 'doctor' ? 'Doctor' : 'Staff'

    // Determine visual colors based on role
    const primaryColor = activeRole === 'staff' ? '#567257' : '#896a58'
    const secondaryColor = activeRole === 'staff' ? '#d9d8d5' : '#acab9e'
    const textColor = '#2a2420'
    const bgGradient = activeRole === 'staff'
        ? 'linear-gradient(135deg, #d9d8d5 0%, #acab9e 100%)'
        : 'linear-gradient(135deg, #acab9e 0%, #896a58 100%)';

    const registerImage = activeRole === 'staff' ? '/staff.png' : '/doctor.png';

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#d9d8d5',
            padding: '40px 20px',
            fontFamily: 'var(--font-family)'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                maxWidth: 1000,
                minHeight: 550,
                background: 'white',
                borderRadius: 24,
                boxShadow: '0 20px 40px rgba(42, 36, 32, 0.1)',
                overflow: 'hidden',
                position: 'relative'
            }}>

                {/* LEFT SIDE - FORM */}
                <div style={{
                    flex: '0 0 45%',
                    padding: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 2,
                    background: 'white'
                }}>

                    {/* Header Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 12, marginBottom: 40, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: 36, height: 36, background: primaryColor,
                            borderRadius: 10, color: 'white'
                        }}>
                            <PawPrint size={20} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: textColor }}>VetAI</span>
                    </div>

                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: textColor, marginBottom: 8 }}>
                        Create Account
                    </h2>
                    <p style={{ color: '#acab9e', marginBottom: 24, fontSize: '1.05rem', fontWeight: 600 }}>
                        Welcome to {roleTitle} Platform
                    </p>

                    {/* Role Tabs */}
                    <div style={{
                        display: 'flex', background: '#f8fafc', borderRadius: 12, padding: 4, marginBottom: 24
                    }}>
                        <button
                            type="button"
                            onClick={() => handleRoleSwitch('staff')}
                            style={{
                                flex: 1, padding: '10px 0', border: 'none', borderRadius: 8,
                                background: activeRole === 'staff' ? 'white' : 'transparent',
                                color: activeRole === 'staff' ? '#567257' : '#acab9e',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                boxShadow: activeRole === 'staff' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s'
                            }}
                        >
                            <ClipboardList size={16} /> Staff
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleSwitch('doctor')}
                            style={{
                                flex: 1, padding: '10px 0', border: 'none', borderRadius: 8,
                                background: activeRole === 'doctor' ? 'white' : 'transparent',
                                color: activeRole === 'doctor' ? '#896a58' : '#acab9e',
                                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                                boxShadow: activeRole === 'doctor' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s'
                            }}
                        >
                            <Stethoscope size={16} /> Doctor
                        </button>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
                            marginBottom: 16, color: '#dc2626', fontSize: '0.85rem'
                        }}>
                            <AlertCircle size={16} /><span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                        {/* Full Name */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <User size={16} />
                                </div>
                                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                                    placeholder={activeRole === 'doctor' ? 'Dr. John Smith' : 'John Smith'}
                                    required
                                    style={{ width: '100%', padding: '12px 16px 12px 40px', fontSize: '0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', color: '#334155', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = primaryColor; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Mail size={16} />
                                </div>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    placeholder={activeRole === 'doctor' ? 'doctor@hospital.com' : 'staff@hospital.com'}
                                    required
                                    style={{ width: '100%', padding: '12px 16px 12px 40px', fontSize: '0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', color: '#334155', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = primaryColor; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                                    <Lock size={16} />
                                </div>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                                    placeholder="password"
                                    required minLength={6}
                                    style={{ width: '100%', padding: '12px 40px 12px 40px', fontSize: '0.9rem', border: '1.5px solid #e2e8f0', borderRadius: 8, outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', color: '#334155', boxSizing: 'border-box' }}
                                    onFocus={e => { e.target.style.borderColor = primaryColor; }}
                                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4, display: 'flex' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Register Button */}
                        <button type="submit" disabled={loading}
                            style={{
                                width: '100%', padding: '12px 24px', marginTop: 16, fontSize: '0.95rem', fontWeight: 600,
                                color: 'white', background: primaryColor, border: 'none', borderRadius: 8,
                                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                                boxShadow: `0 4px 14px ${primaryColor}60`, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                            }}
                            onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = `0 6px 20px ${primaryColor}80`; } }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = `0 4px 14px ${primaryColor}60`; }}
                        >
                            {loading ? <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: '#64748b' }}>
                        Already have an account?{' '}
                        <button type="button" onClick={() => navigate('/login')}
                            style={{ background: 'none', border: 'none', color: primaryColor, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit', padding: 0 }}
                            onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.target.style.textDecoration = 'none'}
                        >
                            Sign in
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE - IMAGE & WAVE */}
                <div style={{
                    flex: '1',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: bgGradient,
                    overflow: 'hidden'
                }}>
                    {/* Wavy Cutout Divider using SVG */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{
                        position: 'absolute',
                        left: -1, top: 0,
                        width: '20%', height: '100%',
                        zIndex: 2, fill: 'white'
                    }}>
                        <path d="M0,0 C100,20 100,80 0,100 Z" />
                    </svg>

                    {/* Decorative Background Elements */}
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
                    <div style={{ position: 'absolute', bottom: '-5%', left: '10%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }} />

                    {/* Overlay Plus icon (from reference image) */}
                    <div style={{ position: 'absolute', bottom: '20%', right: '20%', color: 'white', opacity: 0.6, fontSize: '4rem', fontWeight: 'bold', zIndex: 0 }}>+</div>

                    <img
                        src={registerImage}
                        alt="Medical Professional"
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            width: '75%',
                            maxHeight: '85%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
                            transition: 'opacity 0.3s'
                        }}
                    />
                </div>
            </div>

        </div>
    )
}
