import React from 'react';
import axios from 'axios';

class Jokes extends React.Component {
  state = {
    jokes: [],
    page: 1,
    error: ''
  };

  decrement = e => {
    e.preventDefault();
    if(this.state.page != 1){
      const page = this.state.page - 1;
      this.setState(prevState => ({
        page: prevState.page - 1
      }));
      this.getJokes(page);
    }

  }

  increment = e => {
    e.preventDefault();
    if(this.state.page != 10){
      const page = this.state.page + 1;
      this.setState(prevState => ({
        page: prevState.page + 1
      }));
      this.getJokes(page);
    }
  }

  getJokes = page => {
    const reqOptions = {headers: {
      authorization: localStorage.getItem('jwt'),
      page
    }
  }
    axios.get('http://localhost:3300/api/jokes', reqOptions).then(res => {
      this.setState({ jokes: res.data })
    })
    .catch(error => {
      this.setState({
        error: error.message
      })
    });
  }

  render() {
    return (
      <div className="Jokes">
        <h2>List of Jokes</h2>
        <ul>
          {this.state.error && <p>{this.state.error}</p>}
          {this.state.jokes.map(j => (
            <li key={j.id}>{j.joke}</li>
          ))}
          <button onClick={this.decrement}>←</button>
          {this.state.page}
          <button onClick={this.increment}>→</button>
        </ul>
      </div>
    );
  }

  componentDidMount() {
    const reqOptions = {headers: {
      authorization: localStorage.getItem('jwt'),
      page: this.state.page
    }
  }
    axios.get('http://localhost:3300/api/jokes', reqOptions).then(res => {
      this.setState({ jokes: res.data })
    })
    .catch(error => {
      this.setState({
        error: error.message
      })
    });
  }
}

export default Jokes;