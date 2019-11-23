import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import { VictoryChart, VictoryTheme, VictoryLine, VictoryAxis } from 'victory';
import './index.css';

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      searchKey: '',
      shows: [],
      addKey: '',
      removeKey: '',
      added: null
    }
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAddChange = this.handleAddChange.bind(this);
    this.handleRemoveChange = this.handleRemoveChange.bind(this);
    this.filter = this.filter.bind(this);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.updateShowList = this.updateShowList.bind(this);
  }

  updateShowList() {
    fetch(`http://localhost:3001/api/search?showTitle=${this.state.searchKey}`)
      .then(response => response.json())
      .then(data => {
        if (Object.keys(data).length !== 0) {
          this.setState({ shows: data });
        }
      });
  }

  componentDidMount() {
    this.updateShowList();
  }

  handleSearchChange(evt) {
    this.setState({ searchKey: evt.target.value });
  }

  handleAddChange(evt) {
    this.setState({ addKey: evt.target.value });
  }

  handleRemoveChange(evt) {
    this.setState({ removeKey: evt.target.value });
  }

  added() {
    if(this.state.added === null) {
      return null;
    }
  
    if(this.state.added) {
      this.state.added = null;
      return (
        <div>Success!</div>
      )
    } else {
      this.state.added = null;
      return (
        <div>Failure!</div>
      )
    }
  }

  filter() {
    this.updateShowList();
  }

  async add() {
    const newEntry = this.state.addKey.split(',');
    await fetch(`http://localhost:3001/api/add`, {
      method: 'post',
      body: JSON.stringify({
        title: newEntry[0],
        director: newEntry[1],
        year: newEntry[2]
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (response.status < 400) {
          this.setState({ added: true });
        } else {
          this.setState({ added: false });
        }
      })
  }

  async remove() {
    await fetch(`http://localhost:3001/api/remove`, {
      method: 'post',
      body: JSON.stringify({
        title: this.state.removeKey
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  render() {
    return (
      <div>
        <br></br>
        <br></br>
        Note: Must match title exactly (case-insensitive)
          <FilterForm handleChange={this.handleSearchChange} filter={this.filter} searchKey={this.state.searchKey} />
        <ShowList shows={this.state.shows} />
        <div>
          <br></br>
          <br></br>
          <br></br>
          Would you like to add a show manually?<br></br>
          Enter its title, director, and year, separated by commas.<br></br>
          <input type="text" onChange={this.handleAddChange} value={this.state.addKey} />
          <input type="button" onClick={this.add} value="Add" />
        </div>
        <div>
          <br></br>
          <br></br>
          <br></br>
          Would you like to remove a show manually?<br></br>
          Enter its title.<br></br>
          <input type="text" onChange={this.handleRemoveChange} value={this.state.removeKey} />
          <input type="button" onClick={this.remove} value="Remove" />
        </div>
      </div>
    )
  }
}

class Show extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: {}
    }

    this.updateShow = this.updateShow.bind(this);
  }

  updateShow() {
    console.log(this.props.title);
    fetch(`http://localhost:3001/api/visualize?showTitle=${this.props.match.params.title}`)
      .then(response => response.json())
      .then(data => this.setState({ show: data }));
  }

  componentDidMount() {
    this.updateShow();
  }

  render() {
    if(Object.keys(this.state.show).length > 0) {
      return (
        <div>
          <br></br>
          Season 1<br></br>
          <Victory episodes={this.state.show["Episodes"]} />
        </div>
      )
    } else {
      return null;
    }
  }
}

class Visualized extends React.Component {
  render() {
    return (
      <div>
        <h1>Visualized</h1>
        <h2>Score tracker for all your favorite shows</h2>
        <Router>
          <Link to="/" >Home</Link>

          <Route path="/" exact component={Search} />
          <Route path="/:title" component={Show} />
        </Router>
      </div>

    )
  }
}

function FilterForm(props) {
  return (
    <div>
      <input type="text" onChange={props.handleChange} value={props.searchKey} />
      <input type="button" onClick={props.filter} value="Search" />
    </div>
  );
}

function ShowList(props) {
  console.log(JSON.stringify(Object.keys(props.shows)));
  if (Object.keys(props.shows).length > 0) {
    if(props.shows[0]) {
      return (
        <Link to={`/${props.shows[0].title}`} >{props.shows[0].title}, {props.shows[0].director}, {props.shows[0].year}</Link>
      )
    } else {
      return (
        <Link to={`/${props.shows.show.title}`} >{props.shows.show.title}, {props.shows.show.director}, {props.shows.show.year}</Link>
      )
    }
    
  } else {
    return null;
  }

}

function Victory(props) {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
    >
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc" }
        }}
        data= {props.episodes.map((episode, index) => {
          return { x: index + 1, y: Number(episode.imdbRating) };
        })}
        />
    </VictoryChart>
      )
  }
  
ReactDOM.render(<Visualized />, document.getElementById('root'));
      /*
      import App from './App';
      import * as serviceWorker from './serviceWorker';
      
ReactDOM.render(<App />, document.getElementById('root'));
      
      // If you want your app to work offline and load faster, you can change
      // unregister() to register() below. Note this comes with some pitfalls.
      // Learn more about service workers: https://bit.ly/CRA-PWA
      serviceWorker.unregister();
*/