import React from 'react';
import axios from 'axios';

class Register extends React.Component {
  state = {
    username: '',
    password: ''
  };

  render() {
    return (
      <div className="Form">
        <h2>Register</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username" />
            <input
              name="username"
              id="username"
              placeholder="Username..."
              value={this.state.username}
              onChange={this.handleInputChange}
              type="text"
            />
          </div>
          <div>
            <label htmlFor="password" />
            <input
              name="password"
              placeholder="Password..."
              id="password"
              value={this.state.password}
              onChange={this.handleInputChange}
              type="password"
            />
          </div>

          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();

    const endpoint = 'http://localhost:3300/api/register';

    axios
      .post(endpoint, this.state)
      .then(res => {

        this.props.history.push('/login');
      })
      .catch(error => console.error(error));
  };
}

export default Register;