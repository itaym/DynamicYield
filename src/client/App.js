import React, { Component } from 'react';
import './app.css';
import ReactImage from './react.png';

export default class App extends Component {
  state = { username: null };

  doLogin = async () => {

    const response = await fetch('/login', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({name: this.name.value, password: this.password.value}) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  delUsers = async () => {

    const response = await fetch('/users', {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({name: this.name.value, password: this.password.value}) // body data type must match "Content-Type" header
    });
    let status = response.status;
    let json = await response.json();

    return await response.json(); // parses JSON response into native JavaScript objects
  }

  addUsers = async () => {

    const response = await fetch('/users', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({name: this.name.value, password: this.password.value}) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  getUsers = async () => {
    const response = await fetch('/users');
    return await response.json(); // parses JSON response into native JavaScript objects
  }
  doLogout = async () => {
    const response = await fetch('/logout');
    return await response.json(); // parses JSON response into native JavaScript objects
  }
  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        <input ref={(name) => this.name = name} id={"name"} />
        <input ref={(password) => this.password = password} id={"password"} />
        <input type={"button"} value={"Login"} onClick={this.doLogin} />
        <input type={"button"} value={"Logout"} onClick={this.doLogout} />
        <input type={"button"} value={"getUsers"} onClick={this.getUsers} />
        <input type={"button"} value={"addUsers"} onClick={this.addUsers} />
        <input type={"button"} value={"delUsers"} onClick={this.delUsers} />
        {username ? <h1>{`Hello ${username}`}</h1> : <h1>Loading.. please wait!</h1>}
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
