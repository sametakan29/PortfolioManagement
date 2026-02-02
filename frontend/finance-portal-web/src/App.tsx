import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Stocks from './pages/Stocks'
import Forex from './pages/Forex'
import Bonds from './pages/Bonds'
import Viop from './pages/Viop'
import Funds from './pages/Funds'
import Crypto from './pages/Crypto'
import Kap from './pages/Kap'
import StockDetail from './pages/StockDetail'

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/stocks" element={<Stocks />} />
                <Route path="/stocks/:symbol" element={<StockDetail />} />
                <Route path="/forex" element={<Forex />} />
                <Route path="/bonds" element={<Bonds />} />
                <Route path="/viop" element={<Viop />} />
                <Route path="/funds" element={<Funds />} />
                <Route path="/crypto" element={<Crypto />} />
                <Route path="/kap" element={<Kap />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
            </Routes>
        </Layout>
    )
}

export default App
