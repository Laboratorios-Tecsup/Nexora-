import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles, LayoutDashboard, ImagePlus, GalleryHorizontal,
  CreditCard, User, LogOut, Bell, TrendingUp, Zap
} from 'lucide-react'

export default function Dashboard() {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const { empresa, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await getDashboard()
        setDatos(res.data)
      } catch {
        logout()
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={s.loadingSpinner} />
        <p style={s.loadingText}>Cargando dashboard...</p>
      </div>
    )
  }

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Inicio', active: true },
    { icon: <ImagePlus size={18} />, label: 'Crear Campaña' },
    { icon: <GalleryHorizontal size={18} />, label: 'Mi Contenido' },
    { icon: <CreditCard size={18} />, label: 'Mi Plan' },
    { icon: <User size={18} />, label: 'Perfil' },
  ]

  const stats = [
    {
      icon: <ImagePlus size={22} color="#7F77DD" />,
      label: 'Imágenes restantes',
      value: datos?.creditos_imagenes_restantes,
      total: datos?.creditos_imagenes_totales,
      color: '#7F77DD',
      bg: '#7F77DD22',
    },
    {
      icon: <Zap size={22} color="#378ADD" />,
      label: 'Videos restantes',
      value: datos?.creditos_videos_restantes,
      total: datos?.creditos_videos_totales,
      color: '#378ADD',
      bg: '#378ADD22',
    },
    {
      icon: <TrendingUp size={22} color="#3FB950" />,
      label: 'Plan actual',
      value: datos?.plan_actual?.toUpperCase(),
      total: null,
      color: '#3FB950',
      bg: '#3FB95022',
    },
  ]

  return (
    <div className="dash-page">
      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div style={s.logoRow}>
          <Sparkles size={22} color="#7F77DD" />
          <span style={s.logoText}>NEXORA</span>
        </div>

        <nav style={s.nav}>
          {navItems.map((item, i) => (
            <div key={i} style={item.active ? s.navActive : s.navItem}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={s.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="dash-main">

        {/* TOPBAR MÓVIL — solo visible en pantallas pequeñas */}
        <div className="dash-mobile-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#7F77DD" />
            <span style={{ color: '#fff', fontWeight: '800', letterSpacing: '2px', fontSize: '16px' }}>NEXORA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={s.bellBtn}><Bell size={18} color="#8B949E" /></div>
            <div style={s.avatar}>{(empresa?.nombre_empresa || empresa?.username || 'N')[0].toUpperCase()}</div>
          </div>
        </div>

        {/* TOPBAR */}
        <header style={s.topbar}>
          <div>
            <h1 style={s.pageTitle}>Dashboard</h1>
            <p style={s.pageSubtitle}>Bienvenido de vuelta, <strong style={{ color: '#C9D1D9' }}>{empresa?.nombre_empresa || empresa?.username}</strong></p>
          </div>
          <div style={s.topbarRight}>
            <div style={s.bellBtn}>
              <Bell size={18} color="#8B949E" />
            </div>
            <div style={s.avatar}>
              {(empresa?.nombre_empresa || empresa?.username || 'N')[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="dash-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ ...s.statIcon, background: stat.bg }}>
                {stat.icon}
              </div>
              <div style={s.statInfo}>
                <p style={s.statLabel}>{stat.label}</p>
                <h3 style={{ ...s.statValue, color: stat.color }}>{stat.value}</h3>
                {stat.total !== null && (
                  <div style={s.progressBar}>
                    <div style={{
                      ...s.progressFill,
                      width: `${(stat.value / stat.total) * 100}%`,
                      background: stat.color,
                    }} />
                  </div>
                )}
                {stat.total !== null && (
                  <p style={s.statSub}>de {stat.total} del plan</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA CREAR CAMPAÑA */}
        <div style={s.ctaCard}>
          <div style={s.ctaBlob} />
          <div style={s.ctaContent}>
            <div style={s.ctaBadge}>
              <Sparkles size={14} />
              <span>Impulsado por IA</span>
            </div>
            <h2 style={s.ctaTitle}>Crear Nueva Campaña Publicitaria</h2>
            <p style={s.ctaSub}>
              Sube la foto de tu producto y modelo. Nuestra IA generará imágenes y videos listos para TikTok, Instagram y Facebook en segundos.
            </p>
            <button style={s.ctaBtn}>
              <ImagePlus size={18} />
              <span>Crear ahora</span>
            </button>
          </div>
        </div>

        {/* CAMPAÑAS RECIENTES */}
        <div style={s.section}>
          <div style={s.sectionHeader}>
            <h3 style={s.sectionTitle}>Campañas Recientes</h3>
            <span style={s.sectionLink}>Ver todas →</span>
          </div>
          <div style={s.emptyState}>
            <GalleryHorizontal size={40} color="#30363D" />
            <p style={s.emptyText}>Aún no tienes campañas</p>
            <p style={s.emptySub}>Crea tu primera campaña publicitaria con IA</p>
          </div>
        </div>

      </main>
    </div>
  )
}

const s = {
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 20px 24px',
    borderBottom: '1px solid #21262D',
    marginBottom: '12px',
  },
  logoText: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: '800',
    letterSpacing: '2px',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '0 12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#8B949E',
    cursor: 'pointer',
  },
  navActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#fff',
    background: '#161B22',
    fontWeight: '600',
    cursor: 'pointer',
    borderLeft: '3px solid #7F77DD',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 24px',
    fontSize: '14px',
    color: '#F85149',
    cursor: 'pointer',
    marginTop: 'auto',
  },
  topbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  pageTitle: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  pageSubtitle: {
    color: '#8B949E',
    fontSize: '14px',
    margin: 0,
  },
  topbarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  bellBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: '#161B22',
    border: '1px solid #21262D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #7F77DD, #378ADD)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: '16px',
  },
  statCard: {
    background: '#0D1117',
    border: '1px solid #21262D',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    color: '#8B949E',
    fontSize: '12px',
    margin: '0 0 6px 0',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
  },
  statSub: {
    color: '#8B949E',
    fontSize: '11px',
    margin: '4px 0 0 0',
  },
  progressBar: {
    background: '#21262D',
    borderRadius: '20px',
    height: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '4px',
    borderRadius: '20px',
    transition: 'width 0.5s ease',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #1A1033, #0D1A2E)',
    border: '1px solid #7F77DD44',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaBlob: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, #7F77DD22, transparent 70%)',
    right: '-50px',
    top: '-100px',
    pointerEvents: 'none',
  },
  ctaContent: {
    position: 'relative',
    zIndex: 1,
  },
  ctaBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#7F77DD22',
    border: '1px solid #7F77DD44',
    borderRadius: '20px',
    padding: '4px 12px',
    color: '#7F77DD',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '14px',
  },
  ctaTitle: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 10px 0',
  },
  ctaSub: {
    color: '#8B949E',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 20px 0',
    maxWidth: '500px',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'linear-gradient(135deg, #7F77DD, #378ADD)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  section: {
    background: '#0D1117',
    border: '1px solid #21262D',
    borderRadius: '14px',
    padding: '20px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  sectionLink: {
    color: '#7F77DD',
    fontSize: '13px',
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    gap: '8px',
  },
  emptyText: {
    color: '#C9D1D9',
    fontSize: '15px',
    fontWeight: '600',
    margin: '8px 0 0 0',
  },
  emptySub: {
    color: '#8B949E',
    fontSize: '13px',
    margin: 0,
  },
  loadingPage: {
    minHeight: '100vh',
    background: '#0A0D14',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #21262D',
    borderTop: '3px solid #7F77DD',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#8B949E',
    fontSize: '14px',
  },
}