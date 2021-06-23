import * as React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div>
    <h1>EONET Test Tracker.</h1>
  </div>
);

export default connect()(Home);
