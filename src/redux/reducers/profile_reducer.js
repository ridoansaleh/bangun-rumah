// import { fetchAlbums } from './albums_reducer';
// import { fetchPosts } from './posts_reducer';

const FETCH_USER_START = 'FETCH_USER_START';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILED = 'FETCH_USER_FAILED';

const fetchStart = () => {
  return {
    type: FETCH_USER_START,
  };
};

const fetchSuccess = user => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: user,
  };
};

const fetchFailed = error => {
  return {
    type: FETCH_USER_FAILED,
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

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_START:
      return {
        ...state,
        isFetching: true,
      };
    case FETCH_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSucceed: true,
        isFailed: false,
        data: action.payload,
      };
    case FETCH_USER_FAILED:
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

export { profileReducer, fetchUser };
