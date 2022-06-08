import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { AllImmaNft } from './pages/AllImmaNft';
import { OriginalNft } from './pages/OriginalNft';
import { TestApi } from './pages/TestApi';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<div className="app">
				<div></div>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/allnft" element={<AllImmaNft />} />
					<Route path="/allnft/:nft" element={<Product />} />
					<Route path="/original-nft/:nft" element={<OriginalNft />} />
					<Route path="/test" element={<TestApi />} />
				</Routes>
				<Footer />
			</div>
		</BrowserRouter>
	);
};

export default App;
