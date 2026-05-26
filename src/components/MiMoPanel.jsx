import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
      analyze: `You are a philosopher. Analyze this thought experiment deeply:\n\nTitle: ${experiment.title}\nScenario: ${experiment.scenario}\nQuestion: ${experiment.question}\n\nProvide:\n1. The core philosophical tension\n2. Historical context (2-3 sentences)\n3. Your reasoned stance with justification\n4. A counter-argument to your own stance\n5. A real-world analogy that illuminates the problem\n\nBe concise but profound. No bullet points, write in flowing prose.`,
      perspectives: `You are a multi-perspective analyst. For this thought experiment:\n\nTitle: ${experiment.title}\nScenario: ${experiment.scenario}\nQuestion: ${experiment.question}\n\nGenerate 3 radically different perspectives:\n1. A pragmatist's view (what works in practice)\n2. A philosopher's view (what the ideal framework says)\n3. A contrarian's view (what nobody is saying)\n\nEach perspective should be 2-3 sentences. Label them clearly.`,
      connect: `You are a knowledge connector. This thought experiment is:\n\nTitle: ${experiment.title}\nCategory: ${experiment.category}\nQuestion: ${experiment.question}\n\nConnect it to:\n1. A modern technology or trend\n2. A historical event\n3. A piece of art, literature, or film\n4. A scientific principle\n\nFor each connection, write 1-2 sentences explaining the link. Be creative and unexpected.`,
    }

    try {
      const res = await fetch(`${mimoBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mimo-v2.5',
          messages: [
            { role: 'system', content: 'You are a brilliant philosopher and interdisciplinary thinker. Be concise, original, and thought-provoking. Never use bullet points or numbered lists unless specifically asked.' },
            { role: 'user', content: prompts[type] },
          ],
          temperature: 0.8,
          max_tokens: 600,
        }),
      })
      const data = await res.json()
      setAnalysis(data.choices?.[0]?.message?.content || 'No response received.')
    } catch (err) {
      setAnalysis(`Error: ${err.message}. Check your API key and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-accent2/5 overflow-hidden"
    >
      <div className="p-4 border-b border-accent/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-accent">MiMo Analysis</span>
        </div>
        <span className="text-[10px] font-mono text-text-dim">mimo-v2.5</span>
      </div>

      <div className="flex border-b border-accent/10">
        {[
          { id: 'analyze', label: 'Deep Analysis' },
          { id: 'perspectives', label: 'Multi-Perspective' },
          { id: 'connect', label: 'Connections' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => !loading && analyze(tab.id)}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${activeTab === tab.id && analysis ? 'text-accent border-b-2 border-accent bg-accent/5' : 'text-text-dim hover:text-text'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 min-h-[120px]">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-8">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
            <span className="text-xs text-text-dim font-mono">MiMo is thinking...</span>
          </div>
        ) : analysis ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-text-dim leading-relaxed whitespace-pre-wrap"
          >
            {analysis}
          </motion.div>
        ) : (
          <p className="text-text-dim/40 text-sm text-center py-6">
            Select an analysis type above to explore this experiment with MiMo
          </p>
        )}
      </div>
    </motion.div>
  )
}
