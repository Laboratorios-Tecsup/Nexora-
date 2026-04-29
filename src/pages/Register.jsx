import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registroEmpresa } from '../services/api'
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react'

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    nombre_empresa: '',
    sector: '',
    telefono: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registroEmpresa(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === 'object') {
        const first = Object.entries(data)[0]
        setError(`${first[0]}: ${Array.isArray(first[1]) ? first[1][0] : first[1]}`)
      } else {
        setError('Error al registrarse. Verifica los datos.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={s.page}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.successCard}>
          <CheckCircle size={60} color="#3FB950" />
          <h2 style={s.successTitle}>¡Cuenta creada!</h2>
          <p style={s.successSub}>Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.blob1} />
      <div style={s.blob2} />

      <div style={s.wrapper}>
        {/* Lado izquierdo */}
        <div style={s.left}>
          <div style={s.logoRow}>
            <Sparkles size={28} color="#7F77DD" />
            <span style={s.logoText}>NEXORA</span>
          </div>
          <h1 style={s.hero}>
            Empieza gratis<br />
            <span style={s.heroAccent}>hoy mismo</span>
          </h1>
          <p style={s.heroSub}>
            Únete a cientos de empresas que ya generan contenido publicitario profesional con inteligencia artificial.
          </p>

          {/* Beneficios */}
          <div style={s.benefits}>
            {[
              '5 imágenes gratis al mes',
              '2 videos con avatar IA',
              'Formatos para TikTok, Instagram y Facebook',
              'Sin tarjeta de crédito requerida',
            ].map((b, i) => (
              <div key={i} style={s.benefitItem}>
                <CheckCircle size={16} color="#3FB950" />
                <span style={s.benefitText}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div style={s.card}>
          <h2 style={s.cardTitle}>Crear cuenta gratis</h2>
          <p style={s.cardSub}>Completa tus datos para empezar</p>

          <form onSubmit={handleSubmit}>
            <div style={s.row}>
              <div style={s.inputGroup}>
                <label style={s.label}>Usuario</label>
                <input style={s.input} type="text" name="username"
                  placeholder="usuario123" value={form.username}
                  onChange={handleChange} required />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Teléfono</label>
                <input style={s.input} type="text" name="telefono"
                  placeholder="999888777" value={form.telefono}
                  onChange={handleChange} required />
              </div>
            </div>

            <div style={s.inputGroup}>
              <label style={s.label}>Correo electrónico</label>
              <input style={s.input} type="email" name="email"
                placeholder="tu@empresa.com" value={form.email}
                onChange={handleChange} required />
            </div>

            <div style={s.inputGroup}>
              <label style={s.label}>Contraseña</label>
              <input style={s.input} type="password" name="password"
                placeholder="Mínimo 8 caracteres" value={form.password}
                onChange={handleChange} required />
            </div>

            <div style={s.row}>
              <div style={s.inputGroup}>
                <label style={s.label}>Nombre de la empresa</label>
                <input style={s.input} type="text" name="nombre_empresa"
                  placeholder="Tech Store Peru" value={form.nombre_empresa}
                  onChange={handleChange} required />
              </div>
              <div style={s.inputGroup}>
                <label style={s.label}>Sector</label>
                <input style={s.input} type="text" name="sector"
                  placeholder="Tecnología, Moda..." value={form.sector}
                  onChange={handleChange} required />
              </div>
            </div>

            {error && <p style={s.error}>{error}</p>}

            <button style={s.btn} type="submit" disabled={loading}>
              <span style={s.btnInner}>
                {loading ? 'Creando cuenta...' : (
                  <><span>Crear cuenta gratis</span><ArrowRight size={18} /></>
                )}
              </span>
            </button>
          </form>

          <p style={s.link}>
            ¿Ya tienes cuenta?{' '}
            <span style={s.linkText} onClick={() => navigate('/login')}>
              Inicia sesión
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
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  blob1: {
    position: 'absolute',
    width: '500px', height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #7F77DD33, transparent 70%)',
    top: '-100px', left: '-100px',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: '400px', height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #378ADD33, transparent 70%)',
    bottom: '-100px', right: '-50px',
    pointerEvents: 'none',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    maxWidth: '960px',
    width: '100%',
    position: 'relative',
    zIndex: 1,
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    fontSize: '40px',
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
  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  benefitText: {
    color: '#C9D1D9',
    fontSize: '14px',
  },
  card: {
    background: '#161B22',
    border: '1px solid #30363D',
    borderRadius: '20px',
    padding: '36px',
    width: '100%',
    maxWidth: '440px',
    flexShrink: 0,
  },
  cardTitle: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 6px 0',
  },
  cardSub: {
    color: '#8B949E',
    fontSize: '13px',
    margin: '0 0 24px 0',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  inputGroup: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    color: '#C9D1D9',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: '#0D1117',
    border: '1px solid #30363D',
    borderRadius: '8px',
    color: '#C9D1D9',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
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
    marginTop: '4px',
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
    marginTop: '16px',
  },
  linkText: {
    color: '#7F77DD',
    cursor: 'pointer',
    fontWeight: '600',
  },
  successCard: {
    background: '#161B22',
    border: '1px solid #30363D',
    borderRadius: '20px',
    padding: '60px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
    zIndex: 1,
  },
  successTitle: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
  },
  successSub: {
    color: '#8B949E',
    fontSize: '15px',
    margin: 0,
  },
}