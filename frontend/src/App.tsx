
import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  Monitor,
  Server,
  Database,
  RefreshCw,
  CheckCircle2,
  XCircle,
  LoaderCircle,
} from 'lucide-react'

import apiClient from './services/apiClient'
import './App.css'

type HealthStatus = 'checking' | 'connected' | 'error'

interface HealthResponse {
  status: string
  service: string
  version: string
}

interface DatabaseHealthResponse {
  status: string
  database: string
  connection: string
}

function App() {
  const [backendStatus, setBackendStatus] =
    useState<HealthStatus>('checking')

  const [databaseStatus, setDatabaseStatus] =
    useState<HealthStatus>('checking')

  const [checking, setChecking] = useState(true)

  const [refreshKey, setRefreshKey] = useState(0)

  // Check Backend and Database
  useEffect(() => {
    const controller = new AbortController()

    const options = {
      signal: controller.signal,
    }

    void Promise.allSettled([
      apiClient.get<HealthResponse>(
        '/health',
        options,
      ),

      apiClient.get<DatabaseHealthResponse>(
        '/health/db',
        options,
      ),
    ]).then(([backend, database]) => {
      if (controller.signal.aborted) {
        return
      }

      const backendConnected =
        backend.status === 'fulfilled' &&
        backend.value.data.status === 'ok'

      const databaseConnected =
        database.status === 'fulfilled' &&
        database.value.data.status === 'ok' &&
        database.value.data.connection === 'connected'

      setBackendStatus(
        backendConnected ? 'connected' : 'error',
      )

      setDatabaseStatus(
        databaseConnected ? 'connected' : 'error',
      )

      setChecking(false)
    })

    return () => {
      controller.abort()
    }
  }, [refreshKey])

  // Refresh button
  function handleRefresh() {
    setChecking(true)
    setBackendStatus('checking')
    setDatabaseStatus('checking')

    setRefreshKey((previous) => previous + 1)
  }

  // Render connection status
  function renderStatus(status: HealthStatus) {
    if (status === 'checking') {
      return (
        <span className="status checking">
          <LoaderCircle size={18} className="spin" />
          Checking...
        </span>
      )
    }

    if (status === 'connected') {
      return (
        <span className="status connected">
          <CheckCircle2 size={18} />
          Connected
        </span>
      )
    }

    return (
      <span className="status error">
        <XCircle size={18} />
        Unavailable
      </span>
    )
  }

  const allConnected =
    backendStatus === 'connected' &&
    databaseStatus === 'connected'

  return (
    <main className="health-page">
      <section className="health-container">
        <header className="health-header">
          <ShieldCheck size={44} />

          <div>
            <h1>SecureAuth-TOTP</h1>
            <p>Two-Factor Authentication System</p>
          </div>
        </header>

        <h2>System Health Check</h2>

        <p className="description">
          Development Environment
        </p>

        <div className="system-card">
          <Monitor size={28} />

          <div className="system-info">
            <h3>Frontend</h3>
            <p>React + TypeScript + Vite</p>
          </div>

          {renderStatus('connected')}
        </div>

        <div className="system-card">
          <Server size={28} />

          <div className="system-info">
            <h3>Backend</h3>
            <p>Python + FastAPI</p>
          </div>

          {renderStatus(backendStatus)}
        </div>

        <div className="system-card">
          <Database size={28} />

          <div className="system-info">
            <h3>Database</h3>
            <p>PostgreSQL</p>
          </div>

          {renderStatus(databaseStatus)}
        </div>

        <div
          className={`summary ${checking
              ? 'pending'
              : allConnected
                ? 'success'
                : 'failed'
            }`}
          role="status"
        >
          {checking
            ? 'Checking system...'
            : allConnected
              ? 'All systems operational'
              : 'Some services are unavailable'}
        </div>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={checking}
        >
          <RefreshCw
            size={18}
            className={checking ? 'spin' : ''}
          />

          {checking ? 'Checking...' : 'Check connection'}
        </button>

        <footer>
          SecureAuth-TOTP · Project Foundation
        </footer>
      </section>
    </main>
  )
}

export default App
