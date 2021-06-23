import * as Events from './Events';

export interface ApplicationState {
    events: Events.EventsState | undefined;
}

export const reducers = {
    events: Events.reducer,
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
