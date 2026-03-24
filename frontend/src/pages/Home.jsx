import { useNavigate } from 'react-router-dom'
import { PawPrint, Stethoscope, ClipboardList, Activity, ArrowRight, ActivitySquare, BrainCircuit, Users, HeartPulse, Building2 } from 'lucide-react'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: 'var(--font-family)',
            color: '#1e293b',
            overflowX: 'hidden'
        }}>
            {/* Navigation Bar */}
            <nav style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 5%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 40, height: 40,
                        background: 'linear-gradient(135deg, #896a58, #567257)',
                        borderRadius: 10,
                        color: 'white'
                    }}>
                        <PawPrint size={24} />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2a2420' }}>VetAI</span>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            padding: '8px 20px',
                            background: 'transparent',
                            color: '#896a58',
                            border: '1.5px solid #896a58',
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={e => { e.target.style.background = '#d9d8d5' }}
                        onMouseLeave={e => { e.target.style.background = 'transparent' }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '8px 20px',
                            background: 'linear-gradient(135deg, #896A58, #567257)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(137,106,88,0.3)',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit'
                        }}
                        onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-1px)'
                            e.target.style.boxShadow = '0 6px 20px rgba(137,106,88,0.4)'
                        }}
                        onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 4px 14px rgba(137,106,88,0.3)'
                        }}
                    >
                        Register
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{
                position: 'relative',
                minHeight: '85vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                background: '#2a2420'
            }}>
                {/* Right side background image */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '55%',
                    height: '100%',
                    backgroundImage: 'url("/hero.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }} />

                {/* Left angled dark background */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '65%',
                    height: '100%',
                    background: '#567257',
                    clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
                    zIndex: 1
                }} />

                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: 1200,
                    margin: '0 auto',
                    padding: '160px 5% 100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    textAlign: 'left'
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255, 255, 255, 0.1)', padding: '8px 16px', borderRadius: 999,
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        marginBottom: 24,
                        color: '#d9d8d5', fontWeight: 600, fontSize: '0.9rem'
                    }}>
                        <BrainCircuit size={18} />
                        Next-Generation Veterinary Care
                    </div>
                    <h1 style={{
                        fontSize: '4rem', fontWeight: 800, color: '#ffffff',
                        lineHeight: 1.1, marginBottom: 24, maxWidth: 600
                    }}>
                        Empowering Veterinarians with <span style={{
                            color: '#896a58'
                        }}>AI-Driven</span> Insights
                    </h1>
                    <p style={{
                        fontSize: '1.2rem', color: '#acab9e', marginBottom: 40,
                        maxWidth: 550, lineHeight: 1.6
                    }}>
                        Enhance clinical decision-making, streamline workflows, and improve animal patient outcomes with our state-of-the-art intelligent support system.
                    </p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <button
                            onClick={() => navigate('/register')}
                            style={{
                                padding: '16px 32px',
                                background: '#896a58',
                                color: 'white', border: 'none', borderRadius: 12,
                                fontSize: '1.1rem', fontWeight: 600,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(137, 106, 88, 0.3)',
                                transition: 'all 0.2s', fontFamily: 'inherit'
                            }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)' }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)' }}
                        >
                            Get Started <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => { document.getElementById('about').scrollIntoView({ behavior: 'smooth' }) }}
                            style={{
                                padding: '16px 32px',
                                background: 'transparent',
                                color: '#ffffff', border: '2px solid #ffffff', borderRadius: 12,
                                fontSize: '1.1rem', fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s', fontFamily: 'inherit'
                            }}
                            onMouseEnter={e => {
                                e.target.style.background = '#ffffff';
                                e.target.style.color = '#2a2420';
                            }}
                            onMouseLeave={e => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = '#ffffff';
                            }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" style={{ padding: '100px 5%', background: 'white' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>About VetAI</h2>
                        <div style={{ width: 80, height: 4, background: 'linear-gradient(90deg, #896a58, #567257)', borderRadius: 2, marginBottom: 24 }} />
                        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 800, lineHeight: 1.7 }}>
                            VetAI is a comprehensive Clinical Decision Support System designed exclusively for veterinary practices. By combining the expertise of veterinary professionals with advanced artificial intelligence, we provide tools that analyze multi-modal patient data—from clinical notes to diagnostic imaging—to offer accurate, timely, and actionable insights. Our mission is to reduce administrative burden and elevate the standard of care for every animal.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
                        {[
                            { icon: <HeartPulse size={40} color="#896a58" />, title: 'Better Care', desc: 'Improve diagnostic accuracy and treatment efficacy with data-driven AI support.' },
                            { icon: <ActivitySquare size={40} color="#567257" />, title: 'Efficiency', desc: 'Streamline daily workflows, manage queues intelligently, and reduce manual reporting.' },
                            { icon: <Building2 size={40} color="#acab9e" />, title: 'Scalability', desc: 'Suitable for practices of all sizes, from local clinics to large veterinary hospitals.' },
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                padding: 40, background: '#f8fafc', borderRadius: 24, textAlign: 'center',
                                transition: 'transform 0.3s', cursor: 'default'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ marginBottom: 20, display: 'inline-flex', padding: 20, background: 'white', borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    {item.icon}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: 1.6 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section style={{ padding: '100px 5%', background: '#d9d8d5' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>Our Platform Services</h2>
                        <div style={{ width: 80, height: 4, background: 'linear-gradient(90deg, #896a58, #567257)', borderRadius: 2, margin: '0 auto 24px' }} />
                        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
                            A suite of intelligent tools designed around the needs of modern veterinary staff and doctors.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 30 }}>
                        {[
                            { icon: <Stethoscope size={32} color="#fff" />, title: 'AI Diagnostic Support', desc: 'Input patient vitals and symptoms to receive AI-generated provisional diagnoses and treatment recommendations based on extensive veterinary medical knowledge.', color: '#896a58' },
                            { icon: <Users size={32} color="#fff" />, title: 'Smart Queue Management', desc: 'An intelligent token-based queue system that prioritizes patients based on automated triaging and severity assessment.', color: '#567257' },
                            { icon: <ClipboardList size={32} color="#fff" />, title: 'Automated Reporting', desc: 'Generate comprehensive, structured clinical reports automatically from doctor notes and AI assessments, saving hours of documentation time.', color: '#acab9e' },
                            { icon: <Activity size={32} color="#fff" />, title: 'Vitals Monitoring Dashboard', desc: 'A real-time dashboard for staff to register patients, record initial vitals, and monitor the clinic flow seamlessly.', color: '#d9d8d5' }
                        ].map((service, idx) => (
                            <div key={idx} style={{
                                background: 'white', padding: 32, borderRadius: 20,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                                display: 'flex', flexDirection: 'column', height: '100%'
                            }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 16,
                                    background: service.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 24, boxShadow: `0 8px 24px ${service.color}40`
                                }}>
                                    {service.icon}
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 12 }}>{service.title}</h3>
                                <p style={{ color: '#64748b', lineHeight: 1.6, flex: 1 }}>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact / Footer Section */}
            <section id="contact" style={{ padding: '80px 5% 40px', background: '#2a2420', color: 'white' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 60, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 60, marginBottom: 40 }}>
                        <div style={{ flex: '1 1 300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    width: 40, height: 40, background: 'linear-gradient(135deg, #896a58, #567257)',
                                    borderRadius: 10
                                }}>
                                    <PawPrint size={24} color="white" />
                                </div>
                                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>VetAI</span>
                            </div>
                            <p style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: 24 }}>
                                Next-generation clinical decision support for veterinary practices.
                                Smarter decisions, better care.
                            </p>
                        </div>

                        <div style={{ flex: '1 1 200px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, color: '#f8fafc' }}>Platform</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
                                <span style={{ color: '#94a3b8', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
                            </div>
                        </div>

                        <div style={{ flex: '1 1 300px' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 20, color: '#f8fafc' }}>Contact Us</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: '#94a3b8' }}>
                                <p>Email: vetai@gmail.com</p>
                                <p>Phone: +91 9895486266</p>
                                <p>Address: 123 Innovation Drive, Thrissur District, Kerala, India</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                        &copy; {new Date().getFullYear()} VetAI Clinical Decision Support. All rights reserved.
                    </div>
                </div>
            </section>

        </div>
    )
}
