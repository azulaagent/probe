import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MiMoPanel from '../components/MiMoPanel'

function CornerDots({ className = 'bg-text' }) {
  return (
    <>
      <span className={`absolute top-1.5 left-1.5 w-1.5 h-1.5 ${className}`} />
      <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 ${className}`} />
      <span className={`absolute bottom-1.5 left-1.5 w-1.5 h-1.5 ${className}`} />
      <span className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 ${className}`} />
    </>
  )
}

export default function Experiment({ data, categories, onBack, onToggleSidebar, apiKey }) {
  const [votes, setVotes] = useState(() => data.perspectives.map(p => p.votes))
  const [voted, setVoted] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const cat = categories.find(c => c.id === data.category)
  const totalVotes = votes.reduce((s, v) => s + v, 0)

  const handleVote = (idx) => {
    if (voted !== null) return
    setVoted(idx)
    setVotes(prev => prev.map((v, i) => i === idx ? v + 1 : v))
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden w-9 h-9 bg-surface2 flex items-center justify-center text-text-dim hover:text-text transition-colors">
            ☰
          </button>
          <button onClick={onBack} className="flex items-center gap-2 text-text-dim hover:text-text transition-colors text-sm font-mono uppercase tracking-[0.1em] text-[11px]">
            ← Back
          </button>
          <span className="text-border">|</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-0.5" style={{ background: cat?.color, color: '#fff' }}>{cat?.label}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
              {'●'.repeat(data.difficulty)}{'○'.repeat(3 - data.difficulty)} Difficulty
            </span>
            {data.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-mono text-text-dim/50 px-2 py-0.5 bg-surface2 uppercase tracking-[0.1em]">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[-1.5px] mb-10">{data.title}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 md:p-8 bg-bg-dark text-text-light relative mb-8"
        >
          <CornerDots className="bg-accent" />
          <div className="relative z-10">
            <p className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] mb-4">Scenario</p>
            <p className="text-white/80 leading-relaxed text-base">{data.scenario}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-5 bg-accent text-bg-dark mb-10 relative"
        >
          <span className="absolute top-1 left-1 w-1 h-1 bg-bg-dark" />
          <span className="absolute top-1 right-1 w-1 h-1 bg-bg-dark" />
          <span className="absolute bottom-1 left-1 w-1 h-1 bg-bg-dark" />
          <span className="absolute bottom-1 right-1 w-1 h-1 bg-bg-dark" />
          <p className="text-sm font-semibold relative z-10">💡 {data.question}</p>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-[-0.5px] uppercase">Perspectives</h2>
          <span className="text-[10px] text-text-dim font-mono uppercase tracking-[0.15em]">{totalVotes} total votes</span>
        </div>

        <div className="space-y-3 mb-12">
          {data.perspectives.map((p, i) => {
            const pct = totalVotes > 0 ? Math.round((votes[i] / totalVotes) * 100) : 0
            const isVoted = voted === i
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              >
                <button
                  onClick={() => handleVote(i)}
                  disabled={voted !== null}
                  className={`w-full text-left p-5 border-2 transition-all relative overflow-hidden ${isVoted ? 'border-accent bg-accent/10' : voted !== null ? 'border-border opacity-60' : 'border-border hover:border-text hover:bg-surface'}`}
                >
                  {voted !== null && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: pct / 100 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 origin-left"
                      style={{ background: `${cat?.color}15`, width: '100%' }}
                    />
                  )}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm tracking-[-0.3px]">{p.stance}</span>
                      <div className="flex items-center gap-3">
                        {voted !== null && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-sm font-mono font-bold"
                            style={{ color: cat?.color }}
                          >
                            {pct}%
                          </motion.span>
                        )}
                        {isVoted && <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-accent">Your vote</span>}
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpanded(expanded === i ? null : i) }}
                          className="text-xs text-text-dim hover:text-text transition-colors"
                        >
                          {expanded === i ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {expanded === i && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-text-dim leading-relaxed mt-2 overflow-hidden"
                        >
                          {p.argument}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    {voted !== null && expanded !== i && (
                      <p className="text-xs text-text-dim/50 mt-1 truncate">{p.argument.slice(0, 80)}...</p>
                    )}
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>

        {apiKey ? (
          <MiMoPanel experiment={data} apiKey={apiKey} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-6 border-2 border-border bg-surface text-center relative"
          >
            <CornerDots className="bg-text-dim" />
            <p className="text-text font-semibold mb-1 relative z-10">Want deeper analysis?</p>
            <p className="text-text-dim text-xs font-mono uppercase tracking-[0.1em] relative z-10">Connect your MiMo API key in the sidebar to unlock AI perspectives.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
