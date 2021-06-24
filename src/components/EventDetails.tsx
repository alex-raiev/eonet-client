import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '../store';
import * as EventsStore from '../store/Events';

type EventProps =
    EventsStore.DetailState // ... state we've requested from the Redux store
    & typeof EventsStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ itemID: string }>; // ... plus incoming routing parameters

class EventDetails extends React.PureComponent<EventProps> {
    public componentDidMount() {
        this.requestDetails();
    }

    public componentDidUpdate() {
        this.requestDetails();
    }

    private requestDetails() {
        this.props.requestEventDetails(this.props.match.params.itemID);
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
            <div>
                <div className="header">
                <h3>{this.props.selected!.title}</h3>
                <h4>{this.props.selected.description}</h4>
                </div>
                <table className='table text-light' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Categories</th>
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
                <table className='table text-light' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>Sources</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.selected.sources.map((item: EventsStore.Source) =>
                            <tr key={item.id}>
                                <td>{item.url}</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        );
    }
}

export default connect(
    (state: ApplicationState) => state.selected,
    EventsStore.actionCreators
)(EventDetails as any);
