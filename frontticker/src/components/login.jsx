import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            action: 'Login',
            userName: '',
            password: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.sendLoginRequest = this.sendLoginRequest.bind(this)
    }
    handleInputChange(event) {
        const target = event.target;
        const { value, name } = target
        this.setState({ [name]: value }, () => {
        })
    }

    sendLoginRequest(e) {
        e.preventDefault()
        if (this.state.userName.length > 1 && this.state.password.length > 1) {
            if (this.state.action === 'Login') {
                axios.post('http://localhost:8080/login', this.state)
                    .then((res) => {
                        if(res.status===200){
                            localStorage.setItem('token', res.data.token)
                            this.props.logIn()
                        }else{
                            alert('Invalid data')
                        }
                    })
                    .catch(err => { alert(err) })
            }
            if(this.state.action==='Signup'){
                axios.post('http://localhost:8080/createuser',this.state)
                .then((res)=>{
                    console.log(res)
                    if(res.status===201){
                        alert('you can login now')
                    }
                })
                .catch(err=>alert(err))
            }
        } else {
            alert('Fill in credentials')
        }
    }
    render() {
        return (
            <div className="login">
                <h1>{this.state.action}:</h1>
                <form >
                    <label>
                        username:
                <input type="text" name="userName" onChange={this.handleInputChange} />
                    </label>
                    <label>
                        password:
                <input type="password" name="password" onChange={this.handleInputChange} />
                    </label>
                    <br />
                    <input type="submit" name="submit" onClick={this.sendLoginRequest} />
                    <select value={this.state.value} onChange={this.handleInputChange} name="action">
                        <option value="Login">Login</option>
                        <option value="Signup">Signup</option>
                    </select>
                </form>
            </div>
        );
    }
}

export default Login;
