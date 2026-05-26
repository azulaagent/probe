import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar({ open, onClose, categories, selectedCategory, onSelectCategory, onGoHome, apiKey, onSetApiKey, onGoCreate }) {
  const navItems = [
    { id: null, label: 'All Experiments', icon: '◉' },
    ...categories.map(c => ({ id: c.id, label: c.label, icon: c.icon, color: c.color })),
  ]

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface2 flex flex-col z-50 transition-transform duration-300 border-r border-border ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 mb-6">
          <button onClick={onGoHome} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-bg-dark flex items-center justify-center relative">
              <span className="text-accent font-bold text-lg">?</span>
              <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-accent" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-accent" />
              <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-accent" />
              <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-accent" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-[-0.5px] text-text">PROBE</h1>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-dim">Thought Lab</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => {
            const isActive = selectedCategory === item.id
            return (
              <button
                key={item.id ?? 'all'}
                onClick={() => onSelectCategory(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 text-left ${isActive ? 'bg-white/50 text-text' : 'text-text-dim hover:text-text hover:bg-white/30'}`}
              >
                <span className="text-base w-6 text-center">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 space-y-3">
          <button
            onClick={onGoCreate}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-dark text-text-light text-sm font-medium hover:bg-black transition-colors relative"
          >
            <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-accent" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent" />
            <span className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-accent" />
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-accent" />
            <span className="relative z-10 flex items-center gap-2">
              <span>✦</span> Create with MiMo
            </span>
          </button>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-dim block mb-1.5">MiMo API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => onSetApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-white/60 border border-border text-sm text-text placeholder:text-text-dim/40 focus:outline-none focus:border-text transition-colors font-mono"
            />
          </div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-text-dim/40 text-center">Powered by MiMo v2.5</p>
        </div>
      </aside>
    </>
  )
}
