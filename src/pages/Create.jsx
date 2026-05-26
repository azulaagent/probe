import { useState } from 'react'
import { motion } from 'framer-motion'

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'mimo-v2.5',
          messages: [
            {
              role: 'system',
              content: `You are a thought experiment designer. Create original, thought-provoking philosophical dilemmas. Output ONLY valid JSON with these exact keys: title (string), scenario (string, 2-3 sentences), question (string, 1 sentence), perspectives (array of 3 objects, each with: stance (string), argument (string, 2-3 sentences), votes (number 20-80)), tags (array of 3 strings). No markdown, no code fences, just raw JSON.`
            },
            {
              role: 'user',
              content: `Create a thought experiment about: ${topic}\nCategory: ${category}\nMake it genuinely challenging with no clear right answer. Each perspective should be compelling.`
            },
          ],
          temperature: 0.9,
          max_tokens: 800,
        }),
      })
      const data = await res.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        setError('No response from MiMo. Check your API key.')
        return
      }

      let parsed
      try {
        parsed = JSON.parse(content)
      } catch {
        const match = content.match(/\{[\s\S]*\}/)
        if (match) {
          parsed = JSON.parse(match[0])
        } else {
          setError('Failed to parse MiMo response. Try again.')
          return
        }
      }

      if (!parsed.title || !parsed.scenario || !parsed.perspectives) {
        setError('Incomplete response from MiMo. Try again.')
        return
      }

      setResult({ ...parsed, category })
    } catch (err) {
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    if (!result) return
    onCreated(result)
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
          <span className="text-xs font-mono text-accent">✦ MiMo Generator</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create a Thought Experiment</h1>
          <p className="text-text-dim mb-8">Describe a topic and MiMo will generate an original philosophical dilemma.</p>
        </motion.div>

        {!apiKey ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-xl border border-border/30 bg-surface text-center"
          >
            <p className="text-2xl mb-3">🔑</p>
            <p className="text-text font-medium mb-2">MiMo API Key Required</p>
            <p className="text-text-dim text-sm">Enter your MiMo API key in the sidebar to unlock AI-powered experiment generation.</p>
          </motion.div>
        ) : (
          <>
            <div className="space-y-5 mb-8">
              <div>
                <label className="text-xs font-mono text-text-dim uppercase tracking-widest block mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. artificial consciousness, time travel ethics, digital immortality..."
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-dim/30 focus:outline-none focus:border-accent/50 transition-colors"
                  onKeyDown={e => e.key === 'Enter' && generate()}
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-dim uppercase tracking-widest block mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
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
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent2 text-white font-medium text-sm disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Generating...
                  </span>
                ) : (
                  '✦ Generate with MiMo'
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
              >
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-5 rounded-xl bg-surface border border-accent/20">
                  <p className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Generated Experiment</p>
                  <h3 className="text-xl font-bold mb-3">{result.title}</h3>
                  <p className="text-text-dim text-sm leading-relaxed mb-4">{result.scenario}</p>
                  <p className="text-sm text-accent font-medium">💡 {result.question}</p>
                </div>

                <div className="space-y-2">
                  {result.perspectives?.map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface border border-border/50">
                      <p className="font-medium text-sm mb-1">{p.stance}</p>
                      <p className="text-xs text-text-dim leading-relaxed">{p.argument}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreate}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-accent2 text-white font-medium text-sm hover:opacity-90 transition-opacity"
                  >
                    Add to Collection
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="px-6 py-3 rounded-xl border border-border text-text-dim text-sm hover:text-text hover:border-accent/30 transition-all"
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
