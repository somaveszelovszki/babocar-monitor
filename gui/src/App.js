import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import GuiApplication from './components/GuiApplication';

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={GuiApplication}/>
          </div>
        </Router> 
        
    );
  }
}
export default App;