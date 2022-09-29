export default function asyncAction({dispatch}) {
    return next => action => {
        const { meta = {}, error, payload } = action;
        const { resolved, rejected } = meta;
        error ? (rejected && rejected(payload||'errorCode：1')) : (resolved && resolved(payload));
        next(action);
    }
}