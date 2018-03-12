import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import neoData from './sample-neo.js';
import issData from './iss-now.js';

class App extends Component {
  constructor(props){
    super(props)
    let today = new Date()
    this.state = {
      issLat: issData.iss_position.latitude,
      issLong: issData.iss_position.longitude,
      apiKey: "qWIC1REqxtvsBhdyIYOYCLJGNpoNeGUTlHPEc8DI",
      startDate: `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`,
      apiUrl: "https://api.nasa.gov/neo/rest/v1/feed",
      rawData: neoData,
      asteroids: []
    }
  }

  componentWillMount(){
    fetch(`${this.state.apiUrl}?start_date=${this.state.startDate}&api_key=${this.state.apiKey}`).then((rawResponse)=>{
      return rawResponse.json()
    }).then((parsedResponse)=>{
      let neoData = parsedResponse.near_earth_objects
      let newAsteroids = []
      Object.keys(neoData).forEach((date)=>{
        neoData[date].forEach((asteroid) =>{
          newAsteroids.push({
            id: asteroid.neo_reference_id,
            name: asteroid.name,
            date: asteroid.close_approach_data[0].close_approach_date,
            diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min,
            diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max
          })
        })
      })
    this.setState({asteroids: newAsteroids})
    })
  }

  render() {
    console.log(this.state.issLat + " " + this.state.issLong)
    console.log('asteroids', this.state.asteroids)
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Estimated Diameter (feet)</th>
              <th>Date of Closest Approach</th>
              <th>Space identification number</th>
            </tr>
          </thead>
          <tbody>
            {this.state.asteroids.map((asteroid)=>{
              return(
                <tr key={asteroid.id}>
                  <td>{asteroid.name}</td>
                  <td>{asteroid.diameterMin} - {asteroid.diameterMax}</td>
                  <td>{asteroid.date}</td>
                  <td>{asteroid.id}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
