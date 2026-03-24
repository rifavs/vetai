import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StaffDashboard from './pages/StaffDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import PatientRegistration from './pages/PatientRegistration'
import QueueDisplay from './pages/QueueDisplay'
import DiagnosisPanel from './pages/DiagnosisPanel'
import ReportViewer from './pages/ReportViewer'
import PatientsList from './pages/PatientsList'
import PatientDetails from './pages/PatientDetails'
import PatientEdit from './pages/PatientEdit'

// Components
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'

function ProtectedRoute({ children, requireRole }) {
    const { isAuthenticated, loading, user } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requireRole) {
        const roles = Array.isArray(requireRole) ? requireRole : [requireRole]
        if (!roles.includes(user?.role) && user?.role !== 'admin') {
            return <Navigate to="/dashboard" replace />
        }
    }

    return children
}

function AppLayout({ children }) {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

function App() {
    const { loading } = useAuth()

    if (loading) {
        return <LoadingSpinner fullScreen />
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <AppLayout>
                        <Dashboard />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/staff" element={
                <ProtectedRoute requireRole={['staff', 'admin']}>
                    <AppLayout>
                        <StaffDashboard />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/staff/register" element={
                <ProtectedRoute requireRole={['staff', 'admin']}>
                    <AppLayout>
                        <PatientRegistration />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/doctor" element={
                <ProtectedRoute requireRole={['doctor', 'admin']}>
                    <AppLayout>
                        <DoctorDashboard />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/queue" element={
                <ProtectedRoute>
                    <AppLayout>
                        <QueueDisplay />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/diagnosis/:recordId?" element={
                <ProtectedRoute requireRole={['doctor', 'admin']}>
                    <AppLayout>
                        <DiagnosisPanel />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/report/:reportId" element={
                <ProtectedRoute>
                    <AppLayout>
                        <ReportViewer />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/patients" element={
                <ProtectedRoute>
                    <AppLayout>
                        <PatientsList />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/patients/:patientId" element={
                <ProtectedRoute>
                    <AppLayout>
                        <PatientDetails />
                    </AppLayout>
                </ProtectedRoute>
            } />

            <Route path="/patients/:patientId/edit" element={
                <ProtectedRoute>
                    <AppLayout>
                        <PatientEdit />
                    </AppLayout>
                </ProtectedRoute>
            } />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
