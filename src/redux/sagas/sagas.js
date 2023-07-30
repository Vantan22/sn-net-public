import { collection, getDocs } from "firebase/firestore";
import { call, put, takeLatest } from "redux-saga/effects";
import { db } from "../../Api/firebase";
import * as actions from "../actions/actions";
function* fetchPostSaga(action) {
  try {
    const querySnapshot = yield call(getDocs, collection(db, "postItem"));
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    yield put(actions.getPosts.getPostsSuccess(posts));
  } catch (error) {
    yield put(actions.getPosts.getPostsFailure(error));
  }
}
function* mySaga() {
  yield takeLatest(actions.getPosts.getPostsRequest, fetchPostSaga);
}

export default mySaga;
