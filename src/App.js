import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Layouts/homepage/HomePage";
import Signinup from "./Pages/Signin_Signup/Index";

import Newsfeeds from "./Pages/Newsfeeds";

import PrivateRouter from "./Components/CheckLogin/checklogin";
import Chatbot from "./Pages/Chatbot/Chatbot";
import InputEmail from "./Pages/Signin_Signup/Screens/ForgotPassword/InputEmail";
import InputPassword from "./Pages/Signin_Signup/Screens/ForgotPassword/InputPassword";
import Signin from "./Pages/Signin_Signup/Screens/Signin/index";
import Signup from "./Pages/Signin_Signup/Screens/Signup/Signup";
import PersonalInformation from "./Pages/personal-information";
// import EditProfile from "./Pages/personal-information/EditProfile/EditProfile";
// import Messenger from "./Pages/Messenger/Messenger";
import AllFriends from "./Pages/Friends/Components/AllFriends";
import FriendsRequest from "./Pages/Friends/Components/FriendsRequest";
import Home from "./Pages/Friends/Components/Home";
import FriendsSuggestions from "./Pages/Friends/Components/Suggestions";
import Friends from "./Pages/Friends/Friends";
import Chatbox from "./Pages/Messenger/Chatbox";
import Messenger from "./Pages/Messenger/Messenger";
import ModalPost from "./Pages/Newsfeeds/Posts/modal/ModalPost";
import Short from "./Pages/ShortVideo/Short";
import ShortItem from "./Pages/ShortVideo/ShortItem/ShortItem";
import ListChatbot from "./Pages/Chatbot/List";
import Error404 from "./Pages/Error404/Error404";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Signinup />}>
        <Route index element={<Signin />} />
      </Route>
      <Route path="/signup" element={<Signinup />}>
        <Route index element={<Signup />} />
      </Route>
      <Route path="/forgotpassword" element={<Signinup />}>
        <Route index element={<InputEmail />} />
      </Route>
      <Route path="/newpassword/:DocumentId" element={<Signinup />}>
        <Route index element={<InputPassword />} />
      </Route>
      <Route
        path="/"
        element={
          <PrivateRouter>
            <HomePage />
          </PrivateRouter>
        }
      >
        <Route exact path="/" element={<Newsfeeds />}>
          <Route path="/:idPost" element={<ModalPost  />} />
        </Route>

        {/* Cấu hình Route cho ModalPost */}

        <Route path="/Messenger" element={<Messenger />}>
          <Route path="/Messenger/:id" element={<Chatbox />} />
        </Route>

        <Route path="/short" element={<Short />}>
          <Route path="/short/:id" element={<ShortItem />} />
        </Route>
        <Route path="/Chatbot" element={<ListChatbot />}>
          <Route path=":id" element={<Chatbot />} />
        </Route>
        <Route path="/Profile/:id" element={<PersonalInformation />}>
          <Route
            path="/Profile/:id/:idPost"
            element={<ModalPost  />}
          />
        </Route>
        <Route path="/Friends" element={<Friends />}>
          <Route index element={<Home />}></Route>
          <Route path="/Friends/FriendsRequest" element={<FriendsRequest />} />
          <Route path="/Friends/Suggestions" element={<FriendsSuggestions />} />
          <Route path="/Friends/AllFriends" element={<AllFriends />}>
            <Route
              path="/Friends/AllFriends/:id"
              element={<PersonalInformation />}
            >
              <Route
                path="/Friends/AllFriends/:id/:idPost"
                element={<ModalPost  />}
              />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Error404/>} />
    </Routes>
  );
}

export default App;
