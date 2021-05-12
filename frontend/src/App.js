import React, { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { TwitterIcon } from './common/Icon'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import PublicRoute from './utils/PublicRoute';
import PrivateRoute from './utils/PrivateRoute';
import FrontPage from './components/Auth/FrontPage'
import SignUp from './components/Auth/SignUp';
import Login from './components/Auth/Login';
import BeginPasswordReset from './components/Auth/BeginPasswordReset';
import ConfirmPinReset from './components/Auth/ConfirmPinReset';
import ResetPassword from './components/Auth/ResetPassword';
import Home from './components/Home';
import Explore from './components/Explore/Explore';
import SideNav from './components/SideNav';
import Nav from './components/Nav';
import PostPage from './components/PostPage';
import Profile from './components/Profile/Profile';
import FollowerAndFollowing from './components/FollowerAndFollowing/FollowerAndFollowingPage'
import Bookmarks from './components/Bookmarks';
import Connect from './components/Connect';
import Notification from './components/Notification';
import Message from './components/Message/Message';
import ChatPage from './components/Message/ChatPage';
import ChatInfo from './components/Message/ChatInfo';
import { io } from "socket.io-client";
import { getUnreadChatsCount } from './actions/chatActions';
import { getUnreadNotification } from './actions/NotificationAction';
import ChangePassword from './components/ChangePassword';
import WhoToFollow from './components/WhoToFollow';
import Logout from './components/Logout';
import Hashtag from './components/Hashtag';


let lastChatId = ''

function App() {
  const smallScreen = useMediaQuery('(max-width:500px)');

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  const { isAuth, userInfo } = user

  const connectSocket = (user) => {
    const socket = io(`${process.env.REACT_APP_SERVER_URL}`);
    socket.emit("user-join", user)

    socket.on("user-connected", () => {
      dispatch({ type: 'SOCKET_CONNECTED', payload: socket })
    });

    socket.on("message received", (message => {
      if (window.location.pathname === `/messages/${message.chat._id}`) {
        dispatch({ type: 'NEW_MESSAGE', payload: message })
      }
      else {
        if (lastChatId !== message.chat._id) {
          dispatch(getUnreadChatsCount())
          lastChatId = message.chat._id
        }
      }
    }))

    socket.on("notification received", async () => {
      dispatch(getUnreadNotification())
    })

  }

  useEffect(() => {
    if (isAuth) {
      connectSocket(userInfo)
      dispatch(getUnreadChatsCount())
      dispatch(getUnreadNotification())
      const token = JSON.parse(localStorage.getItem('token'))
      dispatch({ type: 'SET_TOKEN', payload: token })
      localStorage.setItem("theme", "0")
      localStorage.setItem("color", "0")
    }
  }, [isAuth])

  useEffect(() => {

    if (isAuth) {
      setLoading(false)
    } else {

      const token = JSON.parse(localStorage.getItem('token'))
      if (!isAuth && token) {

        const fetchUser = async () => {

          try {
            const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
            dispatch({ type: "USER_SUCCESS", payload: data.user })
            dispatch({ type: "USER_AUTH", payload: true })
            setLoading(false)
          } catch (err) {
            setLoading(false)
            dispatch({ type: "USER_AUTH", payload: false })
          }
        }

        fetchUser()

      } else {
        setLoading(false)
      }
    }
  }, [isAuth, dispatch])

  if (loading)
    return <div className="full-page-loader">
      <svg viewBox="0 0 321.666 321.666">
        <g>
          <path d="M320.518,70.438c-1.187-1.076-2.952-1.21-4.287-0.325c-5.903,3.916-13.86,5.904-20.473,6.914  c7.907-6.45,17.13-16.588,17.069-29.652c-0.006-1.314-0.748-2.515-1.921-3.108c-1.173-0.593-2.58-0.478-3.642,0.296  C295.279,53.309,278.1,57.903,271.81,59.37c-4.448-7.33-19.746-28.824-46.187-28.824c-1.479,0-2.988,0.07-4.485,0.207  c-32.859,3.022-48.781,22.237-56.351,37.825c-4.786,9.855-6.888,19.397-7.809,25.699c-5.211-4.542-14.3-11.454-27.829-18.371  C108.481,65.337,72.983,52.739,21.247,52.739c-5.03,0-10.197,0.119-15.358,0.354c-1.174,0.054-2.243,0.693-2.846,1.702  c-0.603,1.009-0.659,2.254-0.148,3.313C13.937,81.04,37.69,94.51,53.153,101.18c-8.484,2.248-17.549,6.634-20.388,13.544  c-1.441,3.508-1.811,9.021,4.608,15.364c9.424,9.312,20.503,14.97,30.265,18.405c-7.648,1.361-13.755,3.697-15.735,7.584  c-0.753,1.48-1.612,4.518,1.1,8.246c13.001,17.878,44.162,24.83,57.98,25.964c-1.753,4.165-5.404,10.928-12.455,17.626  c-15.066,14.309-38.822,21.873-68.7,21.874c-0.003,0-0.006,0-0.009,0c-8.119,0-16.833-0.55-25.903-1.636  c-1.498-0.177-2.944,0.622-3.585,1.99c-0.641,1.367-0.333,2.991,0.764,4.028C40.484,271.42,85.2,291.113,130.41,291.12  c0.009,0,0.015,0,0.023,0c49.772,0,98.504-24.472,130.357-65.463c28.367-36.505,39.233-80.199,30.06-120.383  c6.128-2.623,19.655-10.379,30.406-30.602C322.008,73.258,321.704,71.514,320.518,70.438z" />
        </g>
      </svg>
    </div>

  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute exact path="/" isAuth={isAuth} component={FrontPage} />
        <PublicRoute exact path="/signup" isAuth={isAuth} component={SignUp} />
        <PublicRoute exact path="/login" isAuth={isAuth} component={Login} />
        <Route path='/begin_password_reset' component={BeginPasswordReset} />
        <Route path='/confirm_pin_reset' component={ConfirmPinReset} />
        <Route path='/reset_password' component={ResetPassword} />

        <PrivateRoute exact path="/logout" isAuth={isAuth} component={Logout} />

        <>
          <div className="main">
            {smallScreen && isAuth && <SideNav />}

            {isAuth && <div className="main__nav">
              <Route render={({ location }) => <Nav location={location} />} />
            </div>}


            <div className="main__body">
              <PrivateRoute exact path="/home" isAuth={isAuth} component={Home} />
              <PrivateRoute exact path="/explore" isAuth={isAuth} component={Explore} />
              <PrivateRoute exact path="/post/:id" isAuth={isAuth} component={PostPage} />
              <PrivateRoute exact path="/notifications" isAuth={isAuth} component={Notification} />
              <PrivateRoute exact path="/message" isAuth={isAuth} component={Message} />
              <PrivateRoute exact path="/profile/:username" isAuth={isAuth} component={Profile} />
              <PrivateRoute exact path="/profile/:username/following" isAuth={isAuth} component={FollowerAndFollowing} />
              <PrivateRoute exact path="/profile/:username/followers" isAuth={isAuth} component={FollowerAndFollowing} />
              <PrivateRoute exact path="/messages/:chatId" isAuth={isAuth} component={ChatPage} />
              <PrivateRoute exact path="/messages/:chatId/info" isAuth={isAuth} component={ChatInfo} />
              <PrivateRoute exact path="/bookmark" isAuth={isAuth} component={Bookmarks} />
              <PrivateRoute exact path="/connect" isAuth={isAuth} component={Connect} />
              <PrivateRoute exact path="/hashtag/:name" isAuth={isAuth} component={Hashtag} />
              <PrivateRoute exact path="/change-password" isAuth={isAuth} component={ChangePassword} />
            </div>

            {isAuth && <div className="main__side">
              <WhoToFollow />
            </div>}

          </div>
        </>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
