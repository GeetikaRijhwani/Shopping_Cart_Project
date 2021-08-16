import React, { Component } from 'react'

export default class ViewProduct extends Component {
	constructor(props) {
		super(props)

		this.state = {
			products: [],
			productconf: false,
			cartProducts: [],
		}
		this.cartProduct = {};
		this.fields = {};
		this.token = localStorage.getItem("authToken");
	}

	readValue(event, keyName) {
		this.cartProduct[keyName] = event.target.value;
		this.fields[keyName] = event.target;
	}

	addToCart = (id, price, index) => {
		console.log(id);
		this.cartProduct['qtyInCart'] = document.querySelectorAll('.qtyInCart')[index].value;
		console.log(this.cartProduct);
		this.cartProduct.product_id = id;
		this.cartProduct.user_id = localStorage.getItem('userID');
		this.cartProduct.totalPrice = this.cartProduct.qtyInCart * price;
		console.log(this.cartProduct);
		fetch("http://localhost:8000/cart", {
			method: "POST",
			body: JSON.stringify(this.cartProduct),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + this.token,
			}
		})
			.then(response => response.json())
			.then(message => {
				console.log(message);
				this.props.history.push('/index/cart');
			})
			.catch(err => console.log(err))
	}


	componentDidMount = () => {
		fetch("http://localhost:8000/products", {
			headers: {
				Authorization: "Bearer " + this.token,
			},
		})
			.then((response) => response.json())
			.then((products) => {
				this.setState({ products: products });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	render() {
		return (
			<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>

				{
					this.state.products.map((product, index) => {

						return (
							<div key={index} className="card" style={{ width: "18rem" }}>
								<div className="card-body">
									<h5 className="card-title">{product.productName}</h5>
									<p className="card-text">{product.description}</p>
								</div>
								<ul className="list-group list-group-flush">
									<li className="list-group-item">Quantity Available: {product.quantity}</li>
									<li className="list-group-item">Price: &#8377;{product.unitPrice}</li>
									<li className="list-group-item">Select Quantity</li>
									<li className="list-group-item"><input type="number" defaultValue="1" className="qtyInCart" /></li>
								</ul>
								<div className="card-body">
									<button className="btn btn-primary" onClick={() => { this.addToCart(product._id, product.unitPrice, index); }}>Add to Cart</button>
								</div>
							</div>
						)
					})

				}


			</div >
		)
	}
}
