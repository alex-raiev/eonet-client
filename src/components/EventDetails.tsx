import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as EventsStore from '../store/Events';

type EventProps =
    EventsStore.EventsState // ... state we've requested from the Redux store
  & typeof EventsStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{ itemID: string }>; // ... plus incoming routing parameters

class EventDetails extends React.PureComponent<EventProps> {
    public componentDidMount() {
      var id = this.props.match.params.itemID;
      this.props.requestEventDetails(id);
    }

    public render() {
        return (
          <React.Fragment>
            {this.renderEventDetails()}
          </React.Fragment>
        );  
    }

    private renderEventDetails() {
        return (
            <div>{this.props.match.params.itemID}
                <div>{this.props.selected.title}</div>
                <div>{this.props.selected.description}</div>
                <div>{this.props.selected.link}</div>
                <div>
            <table className='table text-light' aria-labelledby="tabelLabel">
              <thead>
                <tr>
                  <th><i className='icon-arrow-up'></i></th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {this.props.selected.categories.map((item: EventsStore.Category) =>
                  <tr key={item.id}>
                    <td>{item.title}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
      }
}

export default connect(
    (state: ApplicationState) => state.events,
    EventsStore.actionCreators
  )(EventDetails as any);
