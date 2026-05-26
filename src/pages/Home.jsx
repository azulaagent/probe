import { motion } from 'framer-motion'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function Home({ experiments, categories, selectedCategory, onSelectCategory, onOpen, onToggleSidebar, onGoCreate, hasApiKey }) {
  const catInfo = selectedCategory ? categories.find(c => c.id === selectedCategory) : null

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onToggleSidebar} className="lg:hidden w-9 h-9 rounded-lg bg-surface2 flex items-center justify-center text-text-dim hover:text-text transition-colors">
              ☰
            </button>
            <div>
              <h2 className="text-sm font-medium">
                {catInfo ? <span style={{ color: catInfo.color }}>{catInfo.icon} {catInfo.label}</span> : 'All Experiments'}
              </h2>
              <p className="text-xs text-text-dim">{experiments.length} experiments</p>
            </div>
          </div>
          {!hasApiKey && (
            <button onClick={onGoCreate} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Connect MiMo for AI experiments
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            {catInfo ? (
              <span style={{ color: catInfo.color }}>{catInfo.icon} {catInfo.label}</span>
            ) : (
              <>Think <span className="text-accent">deeper</span>.</>
            )}
          </h1>
          <p className="text-text-dim text-lg max-w-xl">
            {catInfo
              ? `Explore thought experiments that challenge our understanding of ${catInfo.label.toLowerCase()}.`
              : 'Explore philosophical dilemmas, vote on your stance, and see how your thinking compares to others.'
            }
          </p>
        </motion.div>

        {!selectedCategory && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:scale-105"
                style={{ borderColor: `${cat.color}40`, color: cat.color, background: `${cat.color}10` }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map(exp => {
            const cat = categories.find(c => c.id === exp.category)
            const totalVotes = exp.perspectives.reduce((s, p) => s + p.votes, 0)
            return (
              <motion.button
                key={exp.id}
                variants={fadeUp}
                onClick={() => onOpen(exp.id)}
                className="text-left p-5 rounded-xl bg-surface border border-border/50 hover:border-accent/30 hover:bg-surface2 transition-all group glow"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: cat?.color, background: `${cat?.color}15` }}
                  >
                    {cat?.icon} {cat?.label}
                  </span>
                  <span className="text-[10px] text-text-dim font-mono">
                    {'●'.repeat(exp.difficulty)}{'○'.repeat(3 - exp.difficulty)}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2 group-hover:text-accent transition-colors">{exp.title}</h3>
                <p className="text-sm text-text-dim line-clamp-2 mb-4 leading-relaxed">
                  {exp.scenario.slice(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-[10px] text-text-dim/60 font-mono">
                  <span>{exp.perspectives.length} perspectives</span>
                  <span>{totalVotes} votes</span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
