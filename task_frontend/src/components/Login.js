import React, { Component } from 'react';
import loginImg from "./Mobile-login.svg";
import { Link } from "react-router-dom";

export default class Login extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logConf: false
		}
		this.user = {}
	}

	readValue(event, keyName) {
		this.user[keyName] = event.target.value;
	}

	hideLogMessage() {
		this.setState({ logConf: false });
	}

	loginUser() {
		fetch("http://localhost:8000/login", {
			method: "POST",
			body: JSON.stringify(this.user),
			headers: { "Content-Type": "application/json" }
		})
			.then(response => response.json())
			.then(message => {
				console.log(message.user._id);
				if (message.code === 0) {
					this.setState({ logConf: true });
				}
				else {
					localStorage.setItem("authToken", message.token);
					localStorage.setItem("authStatus", "true");
					localStorage.setItem("userID", message.user._id)
					this.props.history.replace('/index')
				}
			})
			.catch(err => console.log(err))
	}


	render() {
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<div className="card loginCard" style={{ width: "24rem" }}>
					<img src={loginImg} className="card-img-top" alt="..." />
					<div className="card-body">
						<h5 className="card-title">Login</h5>

						{
							this.state.logConf === true ? (
								<div style={{ marginTop: "20px" }} className="alert alert-danger" onClick={() => {
									this.hideLogMessage()
								}}>Wrong Username or Password</div>
							) : null
						}
						<p className="card-text">Login here to see the demonstration of Authentication</p>
					</div>
					<ul className="list-group list-group-flush">
						<li className="list-group-item"><input type="text" onKeyUp={(event) => { this.readValue(event, "username") }} className="form-control" placeholder="Username" /></li>
						<li className="list-group-item"><input type="password" onKeyUp={(event) => { this.readValue(event, "password") }} className="form-control" placeholder="Password" /></li>
						<li className="list-group-item"><button className="btn btn-primary" onClick={() => this.loginUser()}>Login</button></li>
					</ul>

					<div className="card-body">
						<span>New User?  </span>
						<Link to="/register" className="card-link">Register here</Link>
					</div>
				</div>
			</div>
		)
	}
}
