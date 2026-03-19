import { useState, useEffect, useRef } from 'react'
import {
  AvatarSession,
  AvatarVideo,
  ControlBar,
  useAvatarSession,
} from '@runwayml/avatars-react'
import '@runwayml/avatars-react/styles.css'

const AVATAR_ID = 'eaa8b03d-0a6a-4bd0-83a9-039609b47808'

function CallUI({ onEnd }) {
  const { state, error, end } = useAvatarSession()

  useEffect(() => {
    console.log('AvatarSession state:', state)
    if (error) console.error('AvatarSession error:', error)
  }, [state, error])

  return (
    <div className="session-container">
      <div className="session-header">
        <h2 className="session-title">Ask Lincoln</h2>
        <span className="session-state">{state}</span>
        <button
          className="btn btn-small"
          onClick={() => {
            try { end() } catch (e) { /* ok */ }
            onEnd()
          }}
        >
          End Conversation
        </button>
      </div>
      <div className="avatar-wrapper">
        <AvatarVideo
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      <div className="controls-bar">
        <ControlBar />
      </div>
    </div>
  )
}

function App() {
  const [phase, setPhase] = useState('landing')
  const [credentials, setCredentials] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (phase !== 'provisioning') return

    async function provision() {
      try {
        console.log('Provisioning session...')
        const res = await fetch('/api/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarId: AVATAR_ID }),
        })

        if (!res.ok) {
          const errText = await res.text()
          console.error('Create session failed:', res.status, errText)
          setError('Session creation failed: ' + errText)
          setPhase('landing')
          return
        }

        const data = await res.json()
        console.log('Session created:', data)

        setCredentials({
          sessionId: data.sessionId,
          sessionKey: data.sessionKey,
        })
        setPhase('live')
      } catch (err) {
        console.error('Provisioning error:', err)
        setError('Connection error: ' + err.message)
        setPhase('landing')
      }
    }

    provision()
  }, [phase])

  if (phase === 'provisioning') {
    return (
      <div className="container">
        <div className="content">
          <h1 className="title">Ask Lincoln</h1>
          <div className="spinner" />
          <p className="subtitle">Provisioning session...</p>
          <p className="note">This takes a few seconds.</p>
        </div>
      </div>
    )
  }

  if (phase === 'live' && credentials) {
    return (
      <AvatarSession
        credentials={credentials}
        audio
        video
        onEnd={() => {
          console.log('Session ended')
          setPhase('ended')
        }}
        onError={(err) => {
          console.error('AvatarSession error:', err)
          setError('Connection error: ' + (err?.message || JSON.stringify(err)))
          setPhase('ended')
        }}
      >
        <CallUI onEnd={() => setPhase('ended')} />
      </AvatarSession>
    )
  }

  if (phase === 'ended') {
    return (
      <div className="container">
        <div className="content">
          <h1 className="title">Ask Lincoln</h1>
          <p className="subtitle">Your conversation has concluded.</p>
          <p className="quote">"I am a slow walker, but I never walk back."</p>
          <button className="btn" onClick={() => { setPhase('landing'); setCredentials(null); setError(null); }}>
            Start a New Conversation
          </button>
        </div>
        <footer className="footer">
          Built with <a href="https://docs.dev.runwayml.com/characters/" target="_blank" rel="noopener">Runway Characters API</a> &middot; Deployed on <a href="https://netlify.com" target="_blank" rel="noopener">Netlify</a>
        </footer>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="content">
        <div className="emblem">&#9733;</div>
        <h1 className="title">Ask Lincoln</h1>
        <p className="subtitle">A live conversation with the 16th President of the United States.</p>
        <div className="divider"></div>
        <p className="description">
          Speak with Abraham Lincoln about leadership, the Constitution,
          the weight of difficult decisions, or whatever's on your mind.
          Click below to begin a real-time video conversation.
        </p>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn" onClick={() => { setError(null); setPhase('provisioning'); }}>
          Begin Conversation
        </button>
        <p className="note">Requires camera &amp; microphone access &middot; Best in Chrome</p>
      </div>
      <footer className="footer">
        Built with <a href="https://docs.dev.runwayml.com/characters/" target="_blank" rel="noopener">Runway Characters API</a> &middot; Deployed on <a href="https://netlify.com" target="_blank" rel="noopener">Netlify</a>
      </footer>
    </div>
  )
}

export default App
