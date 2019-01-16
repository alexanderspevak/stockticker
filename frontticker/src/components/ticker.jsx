import React, { Component } from 'react';
import axios from 'axios'
import Ticking from './ticking'


class Ticker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      favs: [],
      activeTicker: null,
      selectedFav: null,
      activateTicker: false
    }
    this.onChange = this.onChange.bind(this)
    this.fetchTicker = this.fetchTicker.bind(this)
    this.fetchFavs = this.fetchFavs.bind(this)
    this.deleteFav = this.deleteFav.bind(this)
    this.addToFavs = this.addToFavs.bind(this)
    this.onChangeFav = this.onChangeFav.bind(this)
    this.activateTicker = this.activateTicker.bind(this)
  }
  componentDidMount() {
    this.fetchFavs()
  }

  onChange(e) {
    const target = e.target;
    const { value, name } = target
    this.setState({ [name]: value })
  }

  onChangeFav(e) {
    const target = e.target;
    const { value, name } = target
    this.setState({
      [name]: value,
      selectedFav: value
    })
  }
  activateTicker(e) {
    if(!this.state.activateTicker){
      this.setState({activateTicker:true},()=>{
        this.fetchTicker()
      })
    }else{
      this.setState({activateTicker:false})
    }
  }
  addToFavs(e) {
    e.preventDefault();
    const token = localStorage.getItem('token')
    let counter = 0;
    for (var i = 0; i < this.state.favs; i++) {
      if (this.state.favs[i].symbol === this.state.activeTicker.symbol)
        counter++
    }
    if (counter > 0) {
      return alert('already in favorites')
    }
    axios.post(`${process.env.REACT_APP_SERVER}/createfav`,
      { tickerSymbol: this.state.activeTicker.symbol },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )
      .then((fav) => {
        var newFavs = [...this.state.favs]
        newFavs.push(fav.data)
        this.setState({ favs: newFavs })
      })
  }

  fetchFavs() {
    const token = localStorage.getItem('token')
    if (token) {
      this.setState({ loading: true })
      axios.get(`${process.env.REACT_APP_SERVER}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(user => {
          if (user.data.Favs && user.data.Favs.length > 0) {
            this.setState({ favs: user.data.Favs })
          }
          this.setState({ loading: false })
        })
        .catch(err => {
          alert(err)
          this.setState({ loading: false })
        })
    }
  }

  fetchTicker(e) {
    if(e) e.preventDefault()
    const symbol = this.state.tickerSymbol ? this.state.tickerSymbol : false
    const token = localStorage.getItem('token')
    if (symbol && token) {
      this.setState({ loading: true })

      axios.get(`${process.env.REACT_APP_SERVER}/symbolsticker/${symbol}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          this.setState({ loading: false })
          if (res.data === 'Unknown symbol') {
            alert(res.data)
          }
          
          this.setState({ activeTicker: res.data }, () => {
            if(this.state.activateTicker){

              setTimeout(this.fetchTicker, 5000)
            }
            
          })

        })
        .catch(err => {
          alert(err)
          this.setState({ loading: false })
        })
    }
  }
  deleteFav(e) {
    if(e) e.preventDefault(e)
    const symbol = this.state.tickerSymbol
    const token = localStorage.getItem('token')
    if (symbol && token) {
      axios.delete(`${process.env.REACT_APP_SERVER}/deletefav/${symbol}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(message => {
          if (message.data === 'Fav deleted') {
            var newFavs = [...this.state.favs];
            var index = -1;
            for (let i = 0; i < newFavs.length; i++) {
              if (newFavs[i].tickerSymbol === symbol) index = i
            }
            if (index > -1) {
              newFavs.splice(index, 1)
              this.setState({ favs: newFavs })
            }
          }
        })
    }
  }

  renderFavs() {
    if (this.state.favs) {
      const favItems = this.state.favs.map((fav) => {
        return (<option key={fav.tickerSymbol} value={fav.tickerSymbol}>{fav.tickerSymbol}</option>)
      })
      return (
        <select onChange={this.onChangeFav} name="tickerSymbol">
          <option value={false}></option>
          {favItems}
        </select>
      )
    }
  }
  render() {
    const favs = this.renderFavs();

    return (
      <div>
        <div><button onClick={this.props.logOut}>Logout</button></div>
        <div className="ticker">
          ticker
          <form >
            <label >ticker symbol:</label>
            <input type="text" onChange={this.onChange} name={'tickerSymbol'} />
            <input type="submit" onClick={this.fetchTicker} name={'fetch'} />
          </form>
          {favs}

          {this.state.selectedFav && this.state.selectedFav !== "false" && <button onClick={this.deleteFav}>Delete {this.state.selectedFav}</button>}
          {this.state.activeTicker && <button onClick={this.addToFavs}>Add to favorites </button>}
          selected ticker:
         {this.state.activeTicker && this.state.activeTicker.symbol}
          {
            !this.state.activateTicker &&
            this.state.activeTicker &&
            <button onClick={this.activateTicker}>activate ticker</button>
          }
          {this.state.activateTicker && <button onClick={this.activateTicker}>stop ticker</button>}
        </div>
        <Ticking data={this.state.activeTicker} />
      </div>

    );
  }
}

export default Ticker;
