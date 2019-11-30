import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Robonaut from './components/Robonaut/Robonaut';

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/robonaut" component={Robonaut}/>
          </div>
        </Router> 
        
    );
  }
}
export default App;