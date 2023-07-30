import { getPosts, getType } from "../actions/actions";

export default function postsReducers(state = {data:{}}, action) {
  switch (action.type) {
    case getType(getPosts.getPostsRequest): // case 'getPostsRequest
      return {
        ...state,
      }; // xử lý action getPosts.getPostsRequest() ở đây
    case getType(getPosts.getPostsSuccess): // case 'getPostsSuccess
      return {
        data: action.payload
      }; // xử lý action getPosts.getPostsSuccess() ở đây
    case getType(getPosts.getPostsFailure): // case 'getPostsFailure
      return {
        ...state,
        loading: false,
      }; // xử lý action getPosts.getPostsFailure() ở đây
    default:
      return state;
  }
}
