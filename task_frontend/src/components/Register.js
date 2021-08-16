import React, { Component } from 'react'
import loginImg from "./Mobile-login.svg"
import { Link } from "react-router-dom";

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			regConf: false,
			flag: false
		}

		this.fields = {};
		this.user = {};
	}

	readValue(event, keyName) {
		console.log(this.state.flag);
		this.user[keyName] = event.target.value;
		this.fields[keyName] = event.target;
		if (this.user.password !== undefined && this.user.password === this.user.pass2) {
			console.log(this.user.password);
			this.setState({ flag: true })
		}
	}

	hideRegMessage() {
		this.setState({ regConf: false });
	}

	componentDidMount() {
		console.log(typeof this.state.flag);
	}

	registerUser() {
		fetch("http://localhost:8000/register", {
			method: "POST",
			body: JSON.stringify(this.user),
			headers: { "Content-Type": "application/json" }
		})
			.then(response => response.json())
			.then(message => {
				console.log(this.state.flag)
				this.setState({ regConf: true });

				this.fields.email.value = "";
				this.fields.username.value = "";
				this.fields.mobileno.value = "";
				this.fields.country.value = "";
				this.fields.password.value = "";
				this.fields.pass2.value = "";

			})
			.catch(err => console.log(err))
	}

	render() {
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div className="card loginCard" style={{ width: "27rem" }}>
					<img src={loginImg} className="card-img-top" alt="..." />
					<div className="card-body">
						<h5 className="card-title">Register</h5>

						{
							this.state.regConf === true ? (
								<div style={{ marginTop: "20px" }} className="alert alert-success" onClick={() => {
									this.hideRegMessage()
								}}>User Registered! Please Login from below link to continue</div>
							) : null
						}
						<p className="card-text">Register here to see the demonstration of Authentication</p>
					</div>
					<ul className="list-group list-group-flush">
						<li className="list-group-item">
							<input type="email"
								onKeyUp={(event) => { this.readValue(event, "email") }}
								className="form-control"
								placeholder="Email" />
						</li>
						<li className="list-group-item">
							<input type="text"
								onKeyUp={(event) => { this.readValue(event, "username") }}
								className="form-control"
								placeholder="Username" />
						</li>

						<li className="list-group-item">
							<input type="number"
								onKeyUp={(event) => { this.readValue(event, "mobileno") }}
								className="form-control"
								placeholder="Mobile Number" />
						</li>

						<li className="list-group-item">
							<input type="text"
								onKeyUp={(event) => { this.readValue(event, "country") }}
								className="form-control"
								placeholder="Country" />
						</li>

						<li className="list-group-item">
							<input type="password"
								onKeyUp={(event) => { this.readValue(event, "password") }}
								className="form-control"
								placeholder="Password" />
						</li>
						<li className="list-group-item">
							<input type="password"
								onKeyUp={(event) => { this.readValue(event, "pass2") }}
								className="form-control"
								placeholder="Confirm Password" />
						</li>

						<li className="list-group-item">
							<button className="btn btn-primary"
								disabled={!this.state.flag}
								onClick={() => this.registerUser()}>
								Register</button>
						</li>

					</ul>
					<div className="card-body">
						<span>Existing Member?  </span>
						<Link to="/login" className="card-link">Login here</Link>
					</div>
				</div>
			</div>
		)
	}
}