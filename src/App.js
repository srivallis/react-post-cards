import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Post from './components/post';
import Home from './components/home';
import Admin from './components/admin';
import {PostProvider} from './context';
import {NotificationContainer} from 'react-notifications';
import ReactTooltip from 'react-tooltip';
import 'react-notifications/lib/notifications.css';
import './App.css';

function App() {

  return (
    <Router>
      <div className="App">
        <NotificationContainer />
        <ReactTooltip />
        <Switch>
          <PostProvider>
              <Route path='/' exact={true}><Home/></Route>
              <Route path='/admin' ><Admin /></Route>
              <Route path='/cards/:title' ><Post /></Route>
          </PostProvider>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
