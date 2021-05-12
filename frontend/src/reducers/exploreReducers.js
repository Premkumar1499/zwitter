

export const exploreReducer = (state = {}, action) => {
    switch (action.type) {
        case "EXPLORE_LIST_LOADING":
            return { ...state, loading: action.payload }
        case "SPORTS":
            return { ...state, sports: action.payload }
        case "HEALTH":
            return { ...state, health: action.payload }
        case "BUSINESS":
            return { ...state, business: action.payload }
        case "SCIENCE":
            return { ...state, science: action.payload }
        default:
            return state
    }
}
