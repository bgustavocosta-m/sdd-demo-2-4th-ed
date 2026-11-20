import { Screen } from './Shell'
import { ArrowRightIcon, PeersIcon } from './icons'

const MINI_BOARD = ['X', '', 'O', '', 'X', '', 'O', '', 'X']

export function Home() {
  return (
    <Screen>
      <div className="stack-12 home-hero">
        <h1 className="h1 h1-hero">
          Pick a game.
          <br />
          Send a link.
          <br />
          Play.
        </h1>
        <p className="lede">No installs, no accounts. You and a friend, browser to browser.</p>
      </div>

      <div className="stack-16">
        <a className="game-card" href="#/tic-tac-toe">
          <span className="mini-board" aria-hidden="true">
            {MINI_BOARD.map((m, i) => (
              <span key={i} className={m ? `mark-${m.toLowerCase()}` : undefined}>
                {m}
              </span>
            ))}
          </span>
          <span className="game-meta">
            <span className="game-title">Tic-tac-toe</span>
            <span className="hint">2 players · three in a row wins</span>
            <span className="play-cta">
              Play <ArrowRightIcon />
            </span>
          </span>
        </a>

        <div className="game-card soon" aria-disabled="true">
          <span className="checker-board" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} className={(Math.floor(i / 4) + i) % 2 === 0 ? 'dark' : undefined} />
            ))}
          </span>
          <span className="game-meta">
            <span className="game-title">Checkers</span>
            <span className="pill">Coming soon</span>
          </span>
        </div>
      </div>

      <p className="footnote">
        <PeersIcon />
        Games run directly between the two browsers. Nothing is saved except your name and avatar on this device.
      </p>
    </Screen>
  )
}
