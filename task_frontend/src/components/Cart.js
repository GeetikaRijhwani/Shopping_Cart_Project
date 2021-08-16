import React, { Component } from 'react'

export default class Cart extends Component {
	constructor(props) {
		super(props)

		this.state = {
			cartProducts: [],
		}
		this.cartProduct = {};
		this.token = localStorage.getItem("authToken");
	}

	updateCart = (id, index) => {
		this.cartProduct = this.state.cartProducts[index];
		this.cartProduct['qtyInCart'] = document.querySelectorAll('.qtyInCart')[index].value;
		let uprice = this.state.cartProducts[index].product_id.unitPrice;
		this.cartProduct.totalPrice = this.cartProduct.qtyInCart * uprice;


		fetch('http://localhost:8000/cart/' + id, {
			method: 'PUT',
			body: JSON.stringify(this.cartProduct),
			headers: {
				Authorization: 'Bearer ' + this.token,
				'Content-Type': 'application/json',
			}
		})
			.then(response => response.json())
			.then((message) => {
				let tempProducts = this.state.cartProducts;
				tempProducts[index] = this.cartProduct;
				this.setState({ cartProducts: tempProducts });
				console.log(message);
			})
			.catch((err) => {
				console.log(err);
			})



	}

	deleteFromCart = (id, index) => {

		fetch('http://localhost:8000/cart/' + id, {
			method: 'DELETE',
			headers: {
				Authorization: 'Bearer ' + this.token,
			}
		})
			.then((response) => response.json())
			.then((message) => {
				console.log(message);
				let tempProducts = this.state.cartProducts;
				tempProducts.splice(index, 1);
				this.setState({ cartProducts: tempProducts });
			})
			.catch((err) => {
				console.log(err);
			})

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
				console.log(cartProducts);
				this.setState({ cartProducts: cartProducts });
			})

	}
	render() {
		return (
			<div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
				{
					this.state.cartProducts.map((product, index) => {
						return (
							<div key={index} className="card" style={{ width: "18rem" }}>
								<div className="card-body">
									<h5 className="card-title">{product.product_id.productName}</h5>
									<p className="card-text">{product.product_id.description}</p>
								</div>
								<ul className="list-group list-group-flush">
									<li className="list-group-item">Price: &#8377;{product.product_id.unitPrice}</li>
									<li className="list-group-item">Total Price: &#8377;{product.totalPrice}</li>
									<li className="list-group-item">Update Quantity</li>
									<li className="list-group-item"><input type="number" defaultValue={product.qtyInCart} className="qtyInCart" /></li>
								</ul>
								<div className="card-body">
									<button className="btn btn-primary" style={{ marginRight: '5px' }} onClick={() => { this.updateCart(product._id, index); }}>Update Cart</button>
									<button className="btn btn-danger" onClick={() => { this.deleteFromCart(product._id, index); }}>Remove</button>
								</div>
							</div>
						)
					})
				}

			</div>
		)
	}
}
