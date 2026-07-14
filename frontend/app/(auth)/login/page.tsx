'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeSlash, SignIn, LockKey, Envelope } from '@phosphor-icons/react';
import { useAuth } from '@/lib/hooks/useAuth';


function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      const redirect = params.get('redirect') || '/dashboard';
      router.push(redirect);
      toast.success('¡Bienvenido!');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Credenciales inválidas';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,6,11,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-200px',
        left: '-200px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,6,11,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '0 20px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Card */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 16,
                padding: 8,
              }}
            >
              <Image
                src="/logo.png"
                alt="Labtronix"
                width={56}
                height={56}
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Labtronix
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
              Sistema de Gestión de Metrología
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div style={{ position: 'relative' }}>
                <Envelope
                  size={18}
                  weight="regular"
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="usuario@labtronix.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: 40 }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <LockKey
                  size={18}
                  weight="regular"
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn--primary btn--lg"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 8,
              }}
            >
              {loading ? (
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              ) : (
                <SignIn size={20} weight="bold" />
              )}
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </motion.button>
          </form>

          {/* Hint */}
          <div style={{
            marginTop: 24,
            padding: '12px 16px',
            background: 'var(--color-surface-2)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--color-text)' }}>Credenciales de prueba:</strong><br />
              admin@labtronix.com · <span style={{ fontFamily: 'var(--font-mono)' }}>Admin2026!</span><br />
              comercial@labtronix.com · <span style={{ fontFamily: 'var(--font-mono)' }}>Comercial2026!</span><br />
              tecnico@labtronix.com · <span style={{ fontFamily: 'var(--font-mono)' }}>Tecnico2026!</span>
            </p>
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: '0.75rem',
          color: 'var(--color-text-subtle)',
        }}>
          Labtronix Metrología © {new Date().getFullYear()} · v1.0 MVP
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner spinner--lg" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

