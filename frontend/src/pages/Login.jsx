import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PawPrint, Stethoscope, ClipboardList, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const [isRegister, setIsRegister] = useState(false)
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

    const { login, register } = useAuth()
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
            if (isRegister) {
                const result = await register({ ...formData, role: activeRole })
                if (result.success) {
                    const loginResult = await login(formData.email, formData.password)
                    if (loginResult.success) {
                        navigate('/dashboard')
                    }
                } else {
                    setError(result.error)
                }
            } else {
                const result = await login(formData.email, formData.password)
                if (result.success) {
                    navigate('/dashboard')
                } else {
                    setError(result.error)
                }
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const roleTitle = activeRole === 'doctor' ? 'Doctor' : 'Staff'

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            padding: '24px',
            fontFamily: 'var(--font-family)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Dynamic Background Elements */}
            <div className="animate-blob" style={{
                position: 'absolute',
                top: '-10%',
                left: '10%',
                width: '40vw',
                height: '40vw',
                background: 'rgba(59, 130, 246, 0.15)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                zIndex: 0
            }} />
            <div className="animate-blob animation-delay-2000" style={{
                position: 'absolute',
                bottom: '-10%',
                right: '10%',
                width: '35vw',
                height: '35vw',
                background: 'rgba(6, 182, 212, 0.15)',
                filter: 'blur(80px)',
                borderRadius: '50%',
                zIndex: 0
            }} />

            <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10 }}>

                {/* Logo Section */}
                <div style={{ 
                    textAlign: 'center', 
                    marginBottom: 40,
                    animation: 'fadeIn 0.8s ease-out'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 72,
                        height: 72,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 20,
                        marginBottom: 16,
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.4)'
                    }}>
                        <PawPrint size={36} color="#3b82f6" />
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: 0,
                        letterSpacing: '-0.025em',
                        background: 'linear-gradient(to right, #1e293b, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>VetAI</h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '1rem',
                        fontWeight: 500,
                        marginTop: 4
                    }}>Clinical Decision Support System</p>
                </div>

                {/* Main Glass Card */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: 'var(--shadow-premium)',
                    overflow: 'hidden',
                    animation: 'fadeIn 1s ease-out'
                }}>

                    {/* Role Tabs */}
                    <div style={{
                        display: 'flex',
                        background: 'rgba(241, 245, 249, 0.5)',
                        padding: '6px'
                    }}>
                        <button
                            type="button"
                            onClick={() => handleRoleSwitch('staff')}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                padding: '14px 0',
                                border: 'none',
                                borderRadius: '18px',
                                background: activeRole === 'staff' ? 'white' : 'transparent',
                                color: activeRole === 'staff' ? '#3b82f6' : '#64748b',
                                fontWeight: activeRole === 'staff' ? 700 : 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: activeRole === 'staff' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'inherit'
                            }}
                        >
                            <ClipboardList size={20} />
                            Staff
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRoleSwitch('doctor')}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                padding: '14px 0',
                                border: 'none',
                                borderRadius: '18px',
                                background: activeRole === 'doctor' ? 'white' : 'transparent',
                                color: activeRole === 'doctor' ? '#3b82f6' : '#64748b',
                                fontWeight: activeRole === 'doctor' ? 700 : 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: activeRole === 'doctor' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                fontFamily: 'inherit'
                            }}
                        >
                            <Stethoscope size={20} />
                            Doctor
                        </button>
                    </div>

                    {/* Form Content */}
                    <div style={{ padding: '40px 48px' }}>

                        {/* Heading */}
                        <div style={{ marginBottom: 32 }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                color: '#0f172a',
                                marginBottom: 8,
                                letterSpacing: '-0.02em'
                            }}>
                                {isRegister ? 'Join VetAI' : 'Welcome Back'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                                {isRegister ? `Register as a ${roleTitle} to get started.` : `Sign in to your ${roleTitle} account.`}
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '14px 18px',
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                borderRadius: 12,
                                marginBottom: 24,
                                color: '#ef4444',
                                fontSize: '0.9rem',
                                fontWeight: 500
                            }}>
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                            {/* Full Name (register only) */}
                            {isRegister && (
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <User size={16} color="#64748b" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder={activeRole === 'doctor' ? 'Dr. John Smith' : 'John Smith'}
                                        required
                                        className="form-input"
                                        style={{
                                            borderRadius: 12,
                                            padding: '12px 16px',
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1.5px solid rgba(226, 232, 240, 0.8)'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Email */}
                            <div className="form-group" style={{ margin: 0 }}>
                                <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Mail size={16} color="#64748b" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={activeRole === 'doctor' ? 'doctor@hospital.com' : 'staff@hospital.com'}
                                    required
                                    className="form-input"
                                    style={{
                                        borderRadius: 12,
                                        padding: '12px 16px',
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        border: '1.5px solid rgba(226, 232, 240, 0.8)'
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div className="form-group" style={{ margin: 0, position: 'relative' }}>
                                <label className="form-label" style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Lock size={16} color="#64748b" />
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="form-input"
                                        style={{
                                            borderRadius: 12,
                                            padding: '12px 16px',
                                            paddingRight: 48,
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            border: '1.5px solid rgba(226, 232, 240, 0.8)'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#94a3b8',
                                            padding: 4,
                                            display: 'flex',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.target.style.background = 'rgba(0,0,0,0.05)'}
                                        onMouseLeave={e => e.target.style.background = 'none'}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '16px 24px',
                                    marginTop: 8,
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    borderRadius: 14,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 12,
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {loading ? (
                                    <div className="loading-spinner" style={{ borderTopColor: 'white' }} />
                                ) : (
                                    <>
                                        {isRegister ? 'Create Account' : 'Login to System'}
                                        {!isRegister && <PawPrint size={18} style={{ opacity: 0.8 }} />}
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Link */}
                        <div style={{
                            textAlign: 'center',
                            marginTop: 32,
                            fontSize: '0.95rem',
                            color: '#64748b',
                            fontWeight: 500
                        }}>
                            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                            <button
                                type="button"
                                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#3b82f6',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit',
                                    padding: '0 4px'
                                }}
                            >
                                {isRegister ? 'Sign In' : 'Register Here'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Label */}
                <div style={{
                    textAlign: 'center',
                    marginTop: 40,
                    opacity: 0.6
                }}>
                    <p style={{
                        color: '#64748b',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        © 2026 VetAI Healthcare Systems • Secure Access
                    </p>
                </div>
            </div>
        </div>
    )
}
