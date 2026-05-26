import { useState } from 'react'
import { motion } from 'framer-motion'

function CornerDots({ className = 'bg-accent' }) {
  return (
    <>
      <span className={`absolute top-1.5 left-1.5 w-1.5 h-1.5 ${className}`} />
      <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 ${className}`} />
      <span className={`absolute bottom-1.5 left-1.5 w-1.5 h-1.5 ${className}`} />
      <span className={`absolute bottom-1.5 right-1.5 w-1.5 h-1.5 ${className}`} />
    </>
  )
}

export default function Create({ categories, onBack, apiKey, onCreated, onToggleSidebar }) {
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('ethics')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const mimoBase = 'https://token-plan-sgp.xiaomimimo.com/v1'

  const generate = async () => {
    if (!topic.trim() || !apiKey) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`${mimoBase}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'mimo-v2.5',
          messages: [
            { role: 'system', content: 'You are a thought experiment designer. Create original, thought-provoking philosophical dilemmas. Output ONLY valid JSON with keys: title (string), scenario (string, 2-3 sentences), question (string, 1 sentence), perspectives (array of 3 objects with: stance, argument, votes), tags (array of 3 strings). No markdown, raw JSON only.' },
            { role: 'user', content: `Create a thought experiment about: ${topic}\nCategory: ${category}\nMake it genuinely challenging with no clear right answer.` },
          ],
          temperature: 0.9,
          max_tokens: 800,
        }),
      })
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) { setError('No response from MiMo.'); return }

      let parsed
      try { parsed = JSON.parse(content) } catch {
        const match = content.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
        else { setError('Failed to parse response.'); return }
      }
      if (!parsed.title || !parsed.scenario || !parsed.perspectives) { setError('Incomplete response.'); return }
      setResult({ ...parsed, category })
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={onToggleSidebar} className="lg:hidden w-9 h-9 bg-surface2 flex items-center justify-center text-text-dim hover:text-text transition-colors">☰</button>
          <button onClick={onBack} className="flex items-center gap-2 text-text-dim hover:text-text transition-colors text-[11px] font-mono uppercase tracking-[0.1em]">← Back</button>
          <span className="text-border">|</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent">✦ MiMo Generator</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[-1.5px] mb-2">Create a Thought Experiment</h1>
          <p className="text-text-dim text-sm font-mono uppercase tracking-[0.05em] mb-8">Describe a topic. MiMo generates an original philosophical dilemma.</p>
        </motion.div>

        {!apiKey ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 border-2 border-border bg-surface text-center relative">
            <CornerDots className="bg-text-dim" />
            <p className="text-2xl mb-3 relative z-10">🔑</p>
            <p className="text-text font-semibold mb-2 relative z-10">MiMo API Key Required</p>
            <p className="text-text-dim text-xs font-mono uppercase tracking-[0.1em] relative z-10">Enter your key in the sidebar to unlock generation.</p>
          </motion.div>
        ) : (
          <>
            <div className="space-y-5 mb-8">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-dim block mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. artificial consciousness, time travel ethics, digital immortality..."
                  className="w-full px-4 py-3 bg-white/60 border-2 border-border text-text placeholder:text-text-dim/30 focus:outline-none focus:border-text transition-colors"
                  onKeyDown={e => e.key === 'Enter' && generate()}
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-dim block mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.1em] font-medium border-2 transition-all"
                      style={{
                        borderColor: category === cat.id ? cat.color : 'var(--color-border)',
                        color: category === cat.id ? cat.color : 'var(--color-text-dim)',
                        background: category === cat.id ? `${cat.color}15` : 'transparent',
                      }}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                disabled={!topic.trim() || loading}
                className="px-8 py-3 bg-bg-dark text-text-light text-sm font-semibold uppercase tracking-[0.1em] disabled:opacity-40 hover:bg-black transition-colors relative"
              >
                <span className="absolute top-1 left-1 w-1 h-1 bg-accent" />
                <span className="absolute top-1 right-1 w-1 h-1 bg-accent" />
                <span className="absolute bottom-1 left-1 w-1 h-1 bg-accent" />
                <span className="absolute bottom-1 right-1 w-1 h-1 bg-accent" />
                <span className="relative z-10">
                  {loading ? 'Generating...' : '✦ Generate with MiMo'}
                </span>
              </button>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-100 border-2 border-red-400 text-red-700 text-sm mb-6 font-mono">
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="p-6 bg-bg-dark text-text-light relative">
                  <CornerDots className="bg-accent" />
                  <p className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] mb-2 relative z-10">Generated Experiment</p>
                  <h3 className="text-xl font-bold tracking-[-0.5px] mb-3 relative z-10">{result.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4 relative z-10">{result.scenario}</p>
                  <p className="text-sm text-accent font-semibold relative z-10">💡 {result.question}</p>
                </div>

                <div className="space-y-2">
                  {result.perspectives?.map((p, i) => (
                    <div key={i} className="p-4 border-2 border-border bg-surface">
                      <p className="font-semibold text-sm mb-1">{p.stance}</p>
                      <p className="text-xs text-text-dim leading-relaxed">{p.argument}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => onCreated(result)}
                    className="flex-1 px-6 py-3 bg-accent text-bg-dark font-semibold text-sm uppercase tracking-[0.1em] hover:bg-accent/90 transition-colors relative"
                  >
                    <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-bg-dark" />
                    <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-bg-dark" />
                    <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-bg-dark" />
                    <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-bg-dark" />
                    <span className="relative z-10">Add to Collection</span>
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-3 border-2 border-border text-text-dim text-sm font-mono uppercase tracking-[0.1em] hover:border-text hover:text-text transition-all"
                  >
                    Discard
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
