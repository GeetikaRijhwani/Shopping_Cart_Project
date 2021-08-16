import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import AddProduct from "./AddProduct";
import ViewProduct from "./ViewProduct";
import Cart from "./Cart";

export default class Index extends Component {
	constructor(props) {
		super(props)

		this.state = {
			cartProducts: [],
			cartLength: 0,
		}
		this.cartProduct = {};
		this.token = localStorage.getItem("authToken");
	}

	componentDidMount = () => {
		this.cartProduct['user_id'] = localStorage.getItem('userID');
		fetch("http://localhost:8000/cart/" + this.cartProduct.user_id, {
			headers: {
				Authorization: "Bearer " + this.token,
			},
		})
			.then(response => response.json())
			.then(cartProducts => {
				let cLength = 0;

				cartProducts.forEach(product => {
					cLength += product.qtyInCart;
				})
				this.setState({ cartLength: cLength });
				this.setState({ cartProducts: cartProducts });
			})

	}

	render() {
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<Link to="/index" className="navbar-brand">Navbar</Link>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
							<li className="nav-item active">
								<Link to="/index" className="nav-link">View Products</Link>
							</li>
							<li className="nav-item">
								<Link to="/index/addProduct" className="nav-link">Add Products</Link>
							</li>
							<li className="nav-item">
								<Link to="/index/cart" className="nav-link">Cart <span>{this.state.cartLength}</span></Link>
							</li>
							{/* <li className="nav-item">
								<a className="nav-link disabled" href="#">Disabled</a>
							</li> */}
						</ul>
					</div>
				</nav>

				<Switch>
					<Route path="/index" exact component={ViewProduct} />
					<Route path="/index/addProduct" exact component={AddProduct} />
					<Route path="/index/cart" exact component={Cart} />

				</Switch>

			</div>
		)
	}
}
