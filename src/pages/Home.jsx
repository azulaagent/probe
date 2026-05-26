import { motion } from 'framer-motion'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

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

export default function Home({ experiments, categories, selectedCategory, onSelectCategory, onOpen, onToggleSidebar, onGoCreate, hasApiKey }) {
  const catInfo = selectedCategory ? categories.find(c => c.id === selectedCategory) : null

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onToggleSidebar} className="lg:hidden w-9 h-9 bg-surface2 flex items-center justify-center text-text-dim hover:text-text transition-colors">
              ☰
            </button>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.05em]">
                {catInfo ? <span style={{ color: catInfo.color }}>{catInfo.icon} {catInfo.label}</span> : 'All Experiments'}
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-dim">{experiments.length} experiments</p>
            </div>
          </div>
          {!hasApiKey && (
            <button onClick={onGoCreate} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent text-bg-dark text-xs font-semibold uppercase tracking-[0.1em] hover:bg-accent/90 transition-colors relative">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-bg-dark" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-bg-dark" />
              <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-bg-dark" />
              <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-bg-dark" />
              <span className="w-1.5 h-1.5 bg-bg-dark animate-pulse" />
              Connect MiMo
            </button>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-[-1.5px] mb-3">
            {catInfo ? (
              <span style={{ color: catInfo.color }}>{catInfo.icon} {catInfo.label}</span>
            ) : (
              <>Think <span className="text-accent2">deeper</span>.</>
            )}
          </h1>
          <p className="text-text-dim text-base md:text-lg max-w-xl font-mono uppercase tracking-[0.02em] text-[14px] leading-[148%]">
            {catInfo
              ? `Explore thought experiments that challenge our understanding of ${catInfo.label.toLowerCase()}.`
              : 'Explore philosophical dilemmas. Vote on your stance. See how your thinking compares.'
            }
          </p>
        </motion.div>

        {!selectedCategory && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.1em] border-2 transition-all hover:scale-105 font-medium"
                style={{ borderColor: cat.color, color: cat.color, background: `${cat.color}10` }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        )}

        <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map(exp => {
            const cat = categories.find(c => c.id === exp.category)
            const totalVotes = exp.perspectives.reduce((s, p) => s + p.votes, 0)
            return (
              <motion.button
                key={exp.id}
                variants={fadeUp}
                onClick={() => onOpen(exp.id)}
                className="text-left p-6 bg-bg-dark text-text-light relative group transition-all hover:translate-y-[-2px]"
                whileTap={{ scale: 0.98 }}
              >
                <CornerDots className="bg-accent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-[10px] font-mono uppercase tracking-[0.15em] px-2 py-0.5"
                      style={{ background: cat?.color, color: '#fff' }}
                    >
                      {cat?.label}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">
                      {'●'.repeat(exp.difficulty)}{'○'.repeat(3 - exp.difficulty)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-[-0.5px] mb-3 group-hover:text-accent transition-colors">{exp.title}</h3>
                  <p className="text-sm text-white/50 line-clamp-2 mb-5 leading-relaxed">
                    {exp.scenario.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-white/30 font-mono uppercase tracking-[0.1em]">
                    <span>{exp.perspectives.length} perspectives</span>
                    <span>{totalVotes} votes</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
