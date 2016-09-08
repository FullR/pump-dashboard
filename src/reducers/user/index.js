import actionRouter from "util/action-router";
import request from "superagent";
import {push} from "react-router-redux";

module.exports = actionRouter({
  user: null,
  error: null,
  pending: false
}, {
  LOGIN:{
    create: (username, password, successRedirect, failRedirect) => (dispatch) => {
      request
        .post("/api/login")
        .set('Accept', 'application/json')
        .send({username, password})
        .end((error, res) => {
          if(error) {
            dispatch({type: "LOGIN_FAIL", error});
            if(failRedirect) {
              dispatch(push(failRedirect));
            }
          } else {
            console.log(res);
            dispatch({type: "LOGIN_SUCCESS", user: res.body.user});
            if(successRedirect) {
              dispatch(push(successRedirect));
            }
          }
        });
    }
  },

  LOGIN_PENDING: {
    reduce: (state) => ({
      user: null,
      error: null,
      pending: true
    })
  },

  LOGIN_SUCCESS: {
    create: (user) => ({user}),
    reduce: (state, {user}) => ({
      user,
      error: null,
      pending: false
    })
  },

  LOGIN_FAIL: {
    create: (error) => ({error}),
    reduce: (state, {error}) => ({
      user: null,
      error,
      pending: false
    })
  }
});
