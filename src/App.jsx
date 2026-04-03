import { useState, useEffect } from 'react'

const AVATAR_URL = 'const AVATAR_URL = 'https://unclepeter.netlify.app/?id=eaa8b03d-0a6a-4bd0-83a9-039609b47808&bypass=SGM2026'
'
const STRIPE_LINK = import.meta.env.VITE_STRIPE_LINK

function App() {
  const [phase, setPhase] = useState('landing')
  const [code, setCode] = useState('')
  const [error, setError] = useState(null)
  const [codeLoading, setCodeLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')
    if (sessionId) {
      setPaymentLoading(true)
      window.history.replaceState({}, '', window.location.pathname)
      fetch('/api/validate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setPhase('session')
          } else {
            setError('Payment could not be verified. Please try again.')
          }
        })
        .catch(() => {
          setError('Payment verification failed. Please try again.')
        })
        .finally(() => setPaymentLoading(false))
    }
  }, [])

  const handleCodeSubmit = async () => {
    if (!code.trim()) return
    setError(null)
    setCodeLoading(true)
    try {
      const res = await fetch('/api/validate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (data.valid) {
        setPhase('session')
      } else {
        setError('Invalid access code. Please try again.')
      }
    } catch (err) {
      setError('Could not validate code. Please try again.')
    } finally {
      setCodeLoading(false)
    }
  }

  const handleBuyAccess = () => {
    if (!STRIPE_LINK) {
      setError('Payment is not configured yet.')
      return
    }
    window.location.href = STRIPE_LINK
  }

  if (phase === 'session') {
    return (
      <iframe
        src={AVATAR_URL}
        allow="camera; microphone; autoplay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 9999,
        }}
      />
    )
  }

  return (
    <div className="container">
      <div className="content">
        <div className="emblem">&#9733;</div>
        <h1 className="title">Ask Lincoln</h1>
        <p className="subtitle">
          A live conversation with the 16th President of the United States.
        </p>
        <div className="divider"></div>
        <p className="description">
          Speak with Abraham Lincoln about leadership, the Constitution, the
          weight of difficult decisions, or whatever's on your mind.
        </p>

        {error && <p className="error-msg">{error}</p>}

        {paymentLoading ? (
          <p className="subtitle">Verifying payment...</p>
        ) : (
          <div className="access-section">
            <div className="code-input-row">
              <input
                type="text"
                className="code-input"
                placeholder="Enter access code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                disabled={codeLoading}
              />
              <button
                className="btn btn-code"
                onClick={handleCodeSubmit}
                disabled={codeLoading || !code.trim()}
              >
                {codeLoading ? '...' : 'Go'}
              </button>
            </div>

            <div className="or-divider">
              <span>or</span>
            </div>

            <button className="btn btn-buy" onClick={handleBuyAccess}>
              Buy Access — $1.99
            </button>
          </div>
        )}

        <p className="note">
          Requires camera &amp; microphone access &middot; Best in Chrome
        </p>
      </div>
      <footer className="footer">
        Built with{' '}
        <a href="https://docs.dev.runwayml.com/characters/" target="_blank" rel="noopener">
          Runway Characters API
        </a>{' '}
        &middot; Deployed on{' '}
        <a href="https://netlify.com" target="_blank" rel="noopener">
          Netlify
        </a>
      </footer>
    </div>
  )
}

export default App
