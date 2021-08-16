import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Login from "./components/Login";
import Routeguard from "./Routeguard";
// import AddProduct from "./components/AddProduct";
import Index from './components/Index';
import Register from "./components/Register";
function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path="/" exact component={Login} />
					<Route path="/login" exact component={Login} />
					<Route path="/register" exact component={Register} />
					<Routeguard dPath="/index" dComponent={Index} />
					{/* <Routeguard dPath="/addProduct" dComponent={AddProduct} /> */}


				</Switch>
			</Router>
		</div>
	);
}

export default App;
