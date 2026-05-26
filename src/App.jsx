import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { experiments, categories } from './data/experiments'
import Home from './pages/Home'
import Experiment from './pages/Experiment'
import Create from './pages/Create'
import Sidebar from './components/Sidebar'

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [customExperiments, setCustomExperiments] = useState([])

  const allExperiments = [...experiments, ...customExperiments]

  const filtered = selectedCategory
    ? allExperiments.filter(e => e.category === selectedCategory)
    : allExperiments

  const openExperiment = (id) => {
    setSelectedId(id)
    setPage('experiment')
    setSidebarOpen(false)
  }

  const goHome = () => {
    setPage('home')
    setSelectedId(null)
  }

  const current = allExperiments.find(e => e.id === selectedId)

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => { setSelectedCategory(cat); goHome(); setSidebarOpen(false) }}
        onGoHome={goHome}
        apiKey={apiKey}
        onSetApiKey={setApiKey}
        onGoCreate={() => { setPage('create'); setSidebarOpen(false) }}
      />

      <main className="flex-1 min-h-screen">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Home
                experiments={filtered}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onOpen={openExperiment}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                onGoCreate={() => setPage('create')}
                hasApiKey={!!apiKey}
              />
            </motion.div>
          )}
          {page === 'experiment' && current && (
            <motion.div key={selectedId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Experiment
                data={current}
                categories={categories}
                onBack={goHome}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                apiKey={apiKey}
              />
            </motion.div>
          )}
          {page === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Create
                categories={categories}
                onBack={goHome}
                apiKey={apiKey}
                onCreated={(exp) => {
                  setCustomExperiments(prev => [...prev, { ...exp, id: `custom-${Date.now()}` }])
                  goHome()
                }}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
