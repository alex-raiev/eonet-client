import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export const baseApiUrl = process.env.REACT_APP_APIURL;
// state

export interface EventsState {
    isLoading: boolean;
    isLoaded: boolean;
    selected: Event | undefined;
    events: Event[];
}

export interface Event {
    id: string;
    title: string;
    description: string;
    link: string;
    categories: Category[];
    sources: Source[];
}

export interface Category{
    id: number;
    title: string;
}

export interface Source{
    id: string;
    url: string;
}

export interface Geometry{
    id: number;
    title: string;
}

// action

interface RequestEventsAction {
    type: 'REQUEST_EVENTS';
}

interface ReceiveEventsAction {
    type: 'RECEIVE_EVENTS';
    events: Event[];
}

interface RequestEventDetailsAction {
    type: 'REQUEST_EVENT_DETAILS';
}

interface ReceiveEventDetailsAction {
    type: 'RECEIVE_EVENT_DETAILS';
    selected: Event;
}

type KnownAction = RequestEventsAction | ReceiveEventsAction 
    | RequestEventDetailsAction | ReceiveEventDetailsAction;

// action creators

export const actionCreators = {
    requestEvents: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.events && appState.events) {
            fetch(baseApiUrl + `/api/v1/eonet/all`)
                .then(response => response.json() as Promise<Event[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_EVENTS', events: data });
                });

            dispatch({ type: 'REQUEST_EVENTS'});
        }
    },
    requestEventDetails : (id : string) : AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.events && appState.events.events.length === 0) {
            fetch(baseApiUrl + `/api/v1/eonet/details?id` + id)
                .then(response => response.json() as Promise<Event>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_EVENT_DETAILS', selected: data });
                });

            dispatch({ type: 'REQUEST_EVENT_DETAILS'});
        }

    }
};

const unloadedState: EventsState = { events: [], selected: undefined, isLoading: false, isLoaded: false };

// reducer

export const reducer: Reducer<EventsState> = (state: EventsState | undefined, incomingAction: Action): EventsState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_EVENTS':
            return {
                events: state.events,
                selected: undefined,
                isLoading: true,
                isLoaded: false
            };
        case 'RECEIVE_EVENTS':
            return {   
                events: action.events,    
                selected: undefined,
                isLoading: false,
                isLoaded: true
            };    
        case 'REQUEST_EVENT_DETAILS':
            return {
                events: state.events,
                selected: state.selected,
                isLoading: true,
                isLoaded: false
            };
        case 'RECEIVE_EVENT_DETAILS':
            return {
                events: [],
                selected: action.selected,
                isLoading: false,
                isLoaded: true
            };
    }

    return state;
};
