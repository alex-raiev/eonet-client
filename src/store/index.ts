import * as Events from './Events';

export interface ApplicationState {
    events: Events.EventsState | undefined;
    selected: Events.DetailState | undefined;
}

export const reducers = {
    events: Events.eventReducer,
    selected: Events.detailReducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
