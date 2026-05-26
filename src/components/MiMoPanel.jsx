import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function CornerDots({ className = 'bg-accent' }) {
  return (
    <>
      <span className={`absolute top-1 left-1 w-1 h-1 ${className}`} />
      <span className={`absolute top-1 right-1 w-1 h-1 ${className}`} />
      <span className={`absolute bottom-1 left-1 w-1 h-1 ${className}`} />
      <span className={`absolute bottom-1 right-1 w-1 h-1 ${className}`} />
    </>
  )
}

export default function MiMoPanel({ experiment, apiKey }) {
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState('analyze')
  const mimoBase = 'https://token-plan-sgp.xiaomimimo.com/v1'

  const analyze = async (type) => {
    setLoading(true)
    setActiveTab(type)
    setAnalysis(null)

    const prompts = {
      analyze: `You are a philosopher. Analyze this thought experiment deeply:\n\nTitle: ${experiment.title}\nScenario: ${experiment.scenario}\nQuestion: ${experiment.question}\n\nProvide:\n1. The core philosophical tension\n2. Historical context (2-3 sentences)\n3. Your reasoned stance with justification\n4. A counter-argument to your own stance\n5. A real-world analogy\n\nBe concise but profound. No bullet points, flowing prose.`,
      perspectives: `You are a multi-perspective analyst. For:\n\nTitle: ${experiment.title}\nScenario: ${experiment.scenario}\nQuestion: ${experiment.question}\n\nGenerate 3 radically different perspectives:\n1. A pragmatist's view\n2. A philosopher's view\n3. A contrarian's view\n\nEach 2-3 sentences. Label clearly.`,
      connect: `You are a knowledge connector. This experiment is:\n\nTitle: ${experiment.title}\nCategory: ${experiment.category}\nQuestion: ${experiment.question}\n\nConnect it to:\n1. A modern technology or trend\n2. A historical event\n3. A piece of art, literature, or film\n4. A scientific principle\n\n1-2 sentences each. Be creative.`,
    }

    try {
      const res = await fetch(`${mimoBase}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: 'mimo-v2.5', messages: [{ role: 'system', content: 'You are a brilliant philosopher. Be concise, original, thought-provoking.' }, { role: 'user', content: prompts[type] }], temperature: 0.8, max_tokens: 600 }),
      })
      const data = await res.json()
      setAnalysis(data.choices?.[0]?.message?.content || 'No response received.')
    } catch (err) {
      setAnalysis(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'analyze', label: 'Deep Analysis' },
    { id: 'perspectives', label: 'Multi-Perspective' },
    { id: 'connect', label: 'Connections' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="border-2 border-text bg-bg-dark text-text-light relative overflow-hidden">
      <CornerDots className="bg-accent" />
      <div className="p-4 border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent animate-pulse" />
          <span className="text-sm font-semibold uppercase tracking-[0.05em] text-accent">MiMo Analysis</span>
        </div>
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.1em]">mimo-v2.5</span>
      </div>

      <div className="flex border-b border-white/10 relative z-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !loading && analyze(tab.id)}
            className={`flex-1 px-4 py-3 text-[11px] font-mono uppercase tracking-[0.1em] font-medium transition-all ${activeTab === tab.id && analysis ? 'text-accent border-b-2 border-accent bg-white/5' : 'text-white/40 hover:text-white/70'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 min-h-[120px] relative z-10">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-8">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 bg-accent" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </div>
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-[0.15em]">MiMo is thinking...</span>
          </div>
        ) : analysis ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </motion.div>
        ) : (
          <p className="text-white/20 text-sm text-center py-6 font-mono uppercase tracking-[0.1em] text-[11px]">
            Select an analysis type above
          </p>
        )}
      </div>
    </motion.div>
  )
}
