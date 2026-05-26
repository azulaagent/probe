import { motion, AnimatePresence } from 'framer-motion'

export default function Sidebar({ open, onClose, categories, selectedCategory, onSelectCategory, onGoHome, apiKey, onSetApiKey, onGoCreate }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-surface border-r border-border z-50 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-border">
          <button onClick={onGoHome} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-lg font-bold">
              ?
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight group-hover:text-accent transition-colors">PROBE</h1>
              <p className="text-xs text-text-dim">Thought Experiment Lab</p>
            </div>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs font-mono text-text-dim uppercase tracking-widest px-3 mb-3">Categories</p>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${!selectedCategory ? 'bg-accent/15 text-accent' : 'text-text-dim hover:text-text hover:bg-surface2'}`}
          >
            All Experiments
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'text-white' : 'text-text-dim hover:text-text hover:bg-surface2'}`}
              style={selectedCategory === cat.id ? { background: `${cat.color}20`, color: cat.color } : {}}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <button
            onClick={onGoCreate}
            className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            ✦ Create with MiMo
          </button>
          <div>
            <label className="text-xs text-text-dim font-mono block mb-1.5">MiMo API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => onSetApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 rounded-lg bg-surface2 border border-border text-sm text-text placeholder:text-text-dim/40 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <p className="text-[10px] text-text-dim/50 font-mono text-center">Powered by MiMo v2.5</p>
        </div>
      </aside>
    </>
  )
}
