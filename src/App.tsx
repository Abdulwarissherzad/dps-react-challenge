import dpsLogo from './assets/DPS.svg';
import './App.css';
import FetchUserData from './components/FetchUserData';

function App() {
	return (
		<>
			<div>
				<a href="https://www.digitalproductschool.io/" target="_blank">
					<img src={dpsLogo} className="logo" alt="DPS logo" />
				</a>
			</div>
			<div className="container   border border-3 rounded-3">
				<FetchUserData />
			</div>
		</>
	);
}

export default App;
