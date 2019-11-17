import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Index from './components/Index/Index';
import About from './components/About/About';
import Examples from './components/Examples/Example';
import Status from './components/Status/Status';
import Template from './components/PageTemplate/PageTemplate';
import Codes from './components/Codes/Codes';
import Robonaut from './components/Robonaut/Robonaut';

class App extends Component {
  render() {
    return (
        <Router>
          <div>
            <Route exact path="/" component={Index}/>
            <Route exact path="/about" component={About}/>
            <Route exact path="/examples" component={Examples}/>
            <Route exact path="/status" component={Status}/>
            <Route exact path="/template" component={Template}/>
            <Route exact path="/codes" component={Codes}/>
            <Route exact path="/robonaut" component={Robonaut}/>
          </div>
        </Router> 
        
    );
  }
}
export default App;