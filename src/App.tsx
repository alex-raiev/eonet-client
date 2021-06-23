import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';

import './custom.css'
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path='/events' component={EventList} />
        <Route exact path='/details/:itemID?' component={EventDetails} />
    </Layout>
);
