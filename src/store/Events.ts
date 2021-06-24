import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

export const baseApiUrl = process.env.REACT_APP_APIURL;
// state

export interface EventsState {
    isLoading: boolean;
    order: string;
    prevOrder: string;
    events: Event[];
}

export interface DetailState {
    isLoading: boolean;
    id: string;
    selected: Event;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    link: string;
    categories: Category[];
    sources: Source[];
}

export interface Category {
    id: number;
    title: string;
}

export interface Source {
    id: string;
    url: string;
}

export interface Geometry {
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
    order: string;
}

interface RequestEventDetailsAction {
    type: 'REQUEST_EVENT_DETAILS';
    id: string;
}

interface ReceiveEventDetailsAction {
    type: 'RECEIVE_EVENT_DETAILS';
    id: string;
    selected: Event;
}

interface ChangeOrderAction{
    type: 'CHANGE_ORDER';
    order: string;
    prevOrder: string;
}


type KnownAction = RequestEventsAction | ReceiveEventsAction
    | RequestEventDetailsAction | ReceiveEventDetailsAction | ChangeOrderAction;

// action creators

export const actionCreators = {
    requestEvents: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.events && appState.events.prevOrder !== appState.events.order) {
            const order =appState.events.order;
            fetch(baseApiUrl + `/api/v1/eonet/all${appState.events.order}`)
                .then(response => response.json() as Promise<Event[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_EVENTS', events: data, order: order});
                });

            dispatch({ type: 'REQUEST_EVENTS' });
        }
    },
    requestEventDetails: (_id: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.selected && _id !== appState.selected.id) {
            fetch(baseApiUrl + `/api/v1/eonet/details?id=${_id}`)
                .then(response => response.json() as Promise<Event>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_EVENT_DETAILS', selected: data, id: _id });
                });

            dispatch({ type: 'REQUEST_EVENT_DETAILS', id: _id });
        }
    },
    setOrder: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const appState = getState();
        if(appState && appState.events){
            const newOrder = appState.events.order.includes("asc") ? "?$orderby=Title desc" : "?$orderby=Title asc";
            dispatch({ type: 'CHANGE_ORDER', order:  newOrder, prevOrder: appState.events.order});
        }
    }
};

const unloadedEventState: EventsState = { events: [], isLoading: false, order: "?$orderby=Title asc", prevOrder: "?$orderby=Title desc"};

const unloadedDetailState: DetailState = {
    selected: {
        id: "",
        description: "",
        link: "",
        title: "",
        categories: [],
        sources: [],
    },
    id: "",
    isLoading: false
};

// reducer

export const eventReducer: Reducer<EventsState> = (state: EventsState | undefined, incomingAction: Action): EventsState => {
    if (state === undefined) {
        return unloadedEventState;
    }

    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_EVENTS':
            return {
                events: state.events,
                order: state.order,
                prevOrder: state.prevOrder,
                isLoading: true
            };
        case 'RECEIVE_EVENTS':
            return {
                events: action.events,
                order: action.order,
                prevOrder: action.order,
                isLoading: false
            };    
        case 'CHANGE_ORDER':
            return {
                events: state.events,
                isLoading: false,
                order: action.order,
                prevOrder: action.prevOrder
            };
    }

    return state;
};

export const detailReducer: Reducer<DetailState> = (state: DetailState | undefined, incomingAction: Action): DetailState => {
    if (state === undefined) {
        return unloadedDetailState;
    }
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_EVENT_DETAILS':
            return {
                selected: state.selected,
                id: state.id,
                isLoading: true
            };
        case 'RECEIVE_EVENT_DETAILS':
            return {
                selected: action.selected,
                id: action.selected.id,
                isLoading: false
            };
    }

    return state;
};

