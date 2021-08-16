import React, { Component } from 'react'

export default class AddProduct extends Component {
	constructor(props) {
		super(props)

		this.state = {
			products: [],
			productconf: false,
		}
		this.product = {};
		this.fields = {};
		this.token = localStorage.getItem("authToken");
	}

	readValue(event, keyName) {
		this.product[keyName] = event.target.value;
		this.fields[keyName] = event.target;
	}
	hideMessage() {
		this.setState({ productconf: false });
	}



	addProduct = () => {
		fetch("http://localhost:8000/product", {
			method: "POST",
			body: JSON.stringify(this.product),
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + this.token,
			}
		})
			.then(response => response.json())
			.then(message => {
				this.setState({ productconf: true });

				this.fields.productName.value = "";
				this.fields.description.value = "";
				this.fields.quantity.value = "";
				this.fields.unitPrice.value = "";
			})
			.catch(err => console.log(err))
	}


	render() {
		return (
			<div className="container" style={{ paddingBottom: "60px" }}>

				<div className="card bg-light mb-3">
					{
						this.state.productconf === true ? (
							<div style={{ marginTop: "20px", cursor: "pointer" }} onClick={() => { this.hideMessage() }} className="alert alert-success">Product Created or Added</div>
						) : null
					}
					<div className="card-header">Add Products</div>
					<div className="card-body">
						<div className="card-title">
							<input type="text" className="form-control" placeholder="Product Name" onKeyUp={(event) => { this.readValue(event, "productName") }} />
						</div>

						<div className="card-title">
							<input type="text" className="form-control" placeholder="Product Description" onKeyUp={(event) => { this.readValue(event, "description") }} />
						</div>

						<div className="card-title">
							<input type="text" className="form-control" placeholder="Quantity" onKeyUp={(event) => { this.readValue(event, "quantity") }} />
						</div>

						<div className="card-title">
							<input type="text" className="form-control" placeholder="Unit Price" onKeyUp={(event) => { this.readValue(event, "unitPrice") }} />
						</div>


						<div className="card-text"><button className="btn btn-primary" onClick={() => { this.addProduct() }}>Add</button></div>
					</div>
				</div>



			</div>
		)
	}
}
