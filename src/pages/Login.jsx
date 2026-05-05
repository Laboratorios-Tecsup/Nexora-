import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginEmpresa } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginEmpresa(form)
      login(res.data.access, res.data.empresa)
      navigate('/dashboard')
    } catch (err) {
      const data = err?.response?.data
      if (data?.detail) {
        setError(data.detail)
      } else {
        setError('Usuario o contraseña incorrectos')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div className="login-wrapper">
        {/* Lado izquierdo */}
        <div className="login-left">
          <div style={s.logoRow}>
            <Sparkles size={28} color="#7F77DD" />
            <span style={s.logoText}>NEXORA</span>
          </div>
          <h1 style={s.hero}>
            Genera anuncios<br />
            <span style={s.heroAccent}>con IA en segundos</span>
          </h1>
          <p style={s.heroSub}>
            Sube la foto de tu producto y modelo. Nuestra IA crea imágenes y
            videos publicitarios listos para TikTok, Instagram y Facebook.
          </p>
          <div style={s.badges}>
            <span style={s.badge}>⚡ Segundos para crear</span>
            <span style={s.badge}>✅ Derechos comerciales</span>
          </div>
        </div>

        {/* Lado derecho — formulario */}
        <div className="login-card">
          <h2 style={s.cardTitle}>Iniciar Sesión</h2>
          <p style={s.cardSub}>Bienvenido de vuelta a Nexora</p>

          <form onSubmit={handleSubmit}>
            <div style={s.inputGroup}>
              <label style={s.label}>Usuario</label>
              <input
                style={s.input}
                type="text"
                name="username"
                placeholder="Tu usuario"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div style={s.inputGroup}>
              <label style={s.label}>Contraseña</label>
              <div style={s.passWrapper}>
                <input
                  style={{ ...s.input, paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Tu contraseña"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span style={s.eyeIcon} onClick={() => setShowPass(!showPass)}>
                  {showPass
                    ? <EyeOff size={18} color="#8B949E" />
                    : <Eye size={18} color="#8B949E" />}
                </span>
              </div>
            </div>

            {error && <p style={s.error}>{error}</p>}

            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Ingresando...' : (
                <span style={s.btnInner}>
                  Iniciar Sesión <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <p style={s.link}>
            ¿No tienes cuenta?{' '}
            <span style={s.linkText} onClick={() => navigate('/registro')}>
              Regístrate gratis
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0A0D14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  blob1: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #7F77DD33, transparent 70%)',
    top: '-100px',
    left: '-100px',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #378ADD33, transparent 70%)',
    bottom: '-100px',
    right: '-50px',
    pointerEvents: 'none',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '2px',
  },
  hero: {
    color: '#fff',
    fontSize: '42px',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: 0,
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #7F77DD, #378ADD)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    color: '#8B949E',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: 0,
  },
  badges: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  badge: {
    background: '#161B22',
    border: '1px solid #30363D',
    borderRadius: '20px',
    padding: '6px 14px',
    color: '#C9D1D9',
    fontSize: '13px',
  },
  cardTitle: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 0 6px 0',
  },
  cardSub: {
    color: '#8B949E',
    fontSize: '14px',
    margin: '0 0 28px 0',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    color: '#C9D1D9',
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: '#0D1117',
    border: '1px solid #30363D',
    borderRadius: '10px',
    color: '#C9D1D9',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  passWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    display: 'flex',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #7F77DD, #378ADD)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  },
  btnInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  error: {
    color: '#F85149',
    fontSize: '13px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  link: {
    color: '#8B949E',
    fontSize: '13px',
    textAlign: 'center',
    marginTop: '20px',
  },
  linkText: {
    color: '#7F77DD',
    cursor: 'pointer',
    fontWeight: '600',
  },
}