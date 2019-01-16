
import React, { Component } from 'react';
import { Login, Ticker } from './components'
import jwt from 'jwt-simple'
import './App.css';


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
    this.decode = this.decode.bind(this)
    this.logInOut = this.logInOut.bind(this)
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      if (this.decode(localStorage.getItem('token'))) {
        this.setState({ loggedIn: true })
      }
    }
  }
  logInOut() {
    this.setState({ loggedIn: !this.state.loggedIn },()=>{
      if(!this.state.loggedIn){
        localStorage.removeItem('token')
      }
    })
  }
  decode(token) {
    try {
      var decoded = jwt.decode(token, process.env.REACT_APP_JWT_SECRET)
      if (decoded.exp > Date.now() / 1000) {
        this.setState({ loggedIn: true })
      }
    } catch (error) {
      console.log('catch error',error)
      return false
    }
  }
  render() {
    const { loggedIn } = this.state
    return (
      <div className="App">
        <header className="App-header">
          {(!loggedIn) && <Login logIn={this.logInOut}/>}
          {loggedIn && <Ticker logOut={this.logInOut} />}
        </header>
      </div>
    );
  }
}

export default App;
