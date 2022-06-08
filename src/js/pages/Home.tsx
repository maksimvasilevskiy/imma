import React from 'react';
import { HomeMain } from '../components/HomeMain';
import { Welcome } from '../components/Welcome';
import { About } from '../components/About';
import { Creation } from '../components/Creation';
import { LifeFeed } from '../components/LifeFeed';
import { AllNft } from '../components/AllNft';
import { ImmaProtocol } from '../components/ImmaProtocol';
import { Faq } from '../components/Faq';
import light1 from '../../assets/images/1.svg';
import light2 from '../../assets/images/2.svg';
import light3 from '../../assets/images/3.svg';
import light4 from '../../assets/images/4.svg';
import light5 from '../../assets/images/5.svg';
import light6 from '../../assets/images/6.svg';
import light7 from '../../assets/images/7.svg';
import light8 from '../../assets/images/8.svg';
import light9 from '../../assets/images/9.svg';
import light10 from '../../assets/images/10.svg';
import light11 from '../../assets/images/11.svg';
import light12 from '../../assets/images/12.svg';
import light13 from '../../assets/images/13.svg';
import lightbg1 from '../../assets/images/left-bottom-light.svg';
import lightbg2 from '../../assets/images/right-top-light.svg';

export const Home: React.FC = () => {
	return (
		<main className="main home">
			<div className="bg-lights"></div>
			{/*<div className="container">
	      <img alt="bg-img" className="home__light home__light-1" src={light1} />
	      <img alt="bg-img" className="home__light home__light-2" src={light2} />
				<img alt="bg-img" className="home__light home__light-3" src={light3} />
	      <img alt="bg-img" className="home__light home__light-4" src={light4} />
	      <img alt="bg-img" className="home__light home__light-5" src={light5} />
	      <img alt="bg-img" className="home__light home__light-6" src={light6} />
	      <img alt="bg-img" className="home__light home__light-7" src={light7} />
	      <img alt="bg-img" className="home__light home__light-8" src={light8} />
	      <img alt="bg-img" className="home__light home__light-9" src={light9} />
	      <img alt="bg-img" className="home__light home__light-10" src={light10} />
	      <img alt="bg-img" className="home__light home__light-11" src={light11} />
	      <img alt="bg-img" className="home__light home__light-12" src={light12} />
	      <img alt="bg-img" className="home__light home__light-13" src={light13} />
			</div>*/}
			<HomeMain />
			<Welcome />
			<About />
			<Creation />
			<LifeFeed />
			<AllNft />
			<ImmaProtocol />
			<Faq />
		</main>
	);
};
