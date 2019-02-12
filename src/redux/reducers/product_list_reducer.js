// import { fetchAlbums } from './albums_reducer';
// import { fetchPosts } from './posts_reducer';

const FETCH_PRODUCTS_START = 'FETCH_PRODUCTS_START';
const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
const FETCH_PRODUCTS_FAILED = 'FETCH_PRODUCTS_FAILED';

const fetchStart = () => {
  return {
    type: FETCH_PRODUCTS_START,
  };
};

const fetchSuccess = user => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: user,
  };
};

const fetchFailed = error => {
  return {
    type: FETCH_PRODUCTS_FAILED,
    error,
  };
};

const fetchUser = id => dispatch => {
  dispatch(fetchStart());
  fetch('https://jsonplaceholder.typicode.com/users/' + id)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error while fetching user's profile");
      }
    })
    .then(json => {
      dispatch(fetchSuccess(json));
      //   dispatch(fetchAlbums(json.id));
      //   dispatch(fetchPosts(json.id));
    })
    .catch(error => {
      dispatch(fetchFailed(error));
      console.error("Error while fetching user's profile at : ", error);
    });
};

let initialState = {
  isFetching: false,
  isSucceed: false,
  isFailed: false,
  data: null,
  error: null,
};

const productsListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSucceed: true,
        isFailed: false,
        data: action.payload,
      };
    case FETCH_PRODUCTS_FAILED:
      return {
        ...state,
        isFailed: true,
        isFetching: false,
        isSucceed: false,
      };
    default:
      return state;
  }
};

export { productsListReducer, fetchUser };
