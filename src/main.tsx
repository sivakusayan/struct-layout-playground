import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import Playground from './Playground.jsx'
import Header from './Header.jsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route index element={<Playground />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
