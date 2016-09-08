import {connect} from "react-redux";
import LoginForm from "components/login-form";
import {actions} from "reducers/user";

function mapStateToProps({user}) {
  return user;
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: ({username, password}) => dispatch(actions.login(username, password, "/counter"))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
