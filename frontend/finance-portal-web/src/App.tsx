import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Stocks from './pages/Stocks'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/stocks" element={<Stocks />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
            </Routes>
        </Layout>
    )
}

export default App
