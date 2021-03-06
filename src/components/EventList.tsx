import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import { Link } from 'react-router-dom';
import * as EventsStore from '../store/Events';

type EventsProps =
  EventsStore.EventsState // ... state we've requested from the Redux store
  & typeof EventsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters

class EventList extends React.PureComponent<EventsProps> {
  public componentDidMount() {
    this.props.requestEvents();
  }

  public render() {
    return (
      <React.Fragment>
        {this.renderEventsTable()}
      </React.Fragment>
    );
  }

  private renderEventsTable() {
    return (
      <table className='table table-striped text-light' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Title <i className='icon-arrow-up'>S</i></th>
            <th>Description</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {this.props.events.map((event: EventsStore.Event) =>
            <tr key={event.id}>
              <td><Link to={`/details/${event.id}`}>{event.title}</Link></td>
              <td>{event.description}</td>
              <td><a href={event.link} >link</a></td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default connect(
  (state: ApplicationState) => state.events, // Selects which state properties are merged into the component's props
  EventsStore.actionCreators // Selects which action creators are merged into the component's props
)(EventList as any); // eslint-disable-line @typescript-eslint/no-explicit-any
