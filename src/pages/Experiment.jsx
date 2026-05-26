import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MiMoPanel from '../components/MiMoPanel'

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
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden w-9 h-9 rounded-lg bg-surface2 flex items-center justify-center text-text-dim hover:text-text transition-colors">
            ☰
          </button>
          <button onClick={onBack} className="flex items-center gap-2 text-text-dim hover:text-text transition-colors text-sm">
            <span>←</span> Back
          </button>
          <span className="text-text-dim/30">|</span>
          <span className="text-xs font-mono" style={{ color: cat?.color }}>{cat?.icon} {cat?.label}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-text-dim">
              {'●'.repeat(data.difficulty)}{'○'.repeat(3 - data.difficulty)} Difficulty
            </span>
            {data.tags?.map(tag => (
              <span key={tag} className="text-[10px] font-mono text-text-dim/50 px-2 py-0.5 rounded-full bg-surface2">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{data.title}</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-xl bg-surface border border-border/50 mb-8"
        >
          <p className="text-xs font-mono text-accent2 uppercase tracking-widest mb-3">Scenario</p>
          <p className="text-text leading-relaxed text-base">{data.scenario}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="p-5 rounded-xl bg-gradient-to-r from-accent/10 to-accent2/10 border border-accent/20 mb-10"
        >
          <p className="text-sm font-medium text-accent">💡 {data.question}</p>
        </motion.div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Perspectives</h2>
          <span className="text-xs text-text-dim font-mono">{totalVotes} total votes</span>
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
                  className={`w-full text-left p-5 rounded-xl border transition-all ${isVoted ? 'border-accent bg-accent/10' : voted !== null ? 'border-border/30 opacity-60' : 'border-border/50 hover:border-accent/30 hover:bg-surface2'} relative overflow-hidden`}
                >
                  {voted !== null && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: pct / 100 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 origin-left"
                      style={{ background: `${cat?.color}10`, width: '100%' }}
                    />
                  )}
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{p.stance}</span>
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
                        {isVoted && <span className="text-xs text-accent">Your vote</span>}
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
            className="p-6 rounded-xl border border-border/30 bg-surface/50 text-center"
          >
            <p className="text-text-dim text-sm mb-2">Want deeper analysis?</p>
            <p className="text-text-dim/50 text-xs">Connect your MiMo API key in the sidebar to unlock AI-powered perspectives on this thought experiment.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
