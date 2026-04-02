import { useState } from 'react'
import { AvatarCall } from '@runwayml/avatars-react'
import '@runwayml/avatars-react/styles.css'

const AVATAR_ID = 'eaa8b03d-0a6a-4bd0-83a9-039609b47808'

function App() {
  const [phase, setPhase] = useState('landing')
  const [error, setError] = useState(null)

  if (phase === 'session') {
    return (
      <iframe
        src="https://unclepeter.netlify.app/?id=eaa8b03d-0a6a-4bd0-83a9-039609b47808"
        allow="camera; microphone; autoplay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          zIndex: 9999
        }}
      />
    )
  }


  if (phase === 'ended') {
    return (
      <div className="container">
        <div className="content">
          <h1 className="title">Ask Lincoln</h1>
          <p className="subtitle">Your conversation has concluded.</p>
          {error && <p className="error-msg">{error}</p>}
          <p className="quote">"I am a slow walker, but I never walk back."</p>
          <button className="btn" onClick={() => { setPhase('landing'); setError(null); }}>
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
        <button className="btn" onClick={() => { setError(null); setPhase('session'); }}>
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
