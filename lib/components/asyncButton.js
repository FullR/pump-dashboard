import React from "react";
import {Button, Spinner} from "elemental";

export default class AsyncButton extends React.Component {
  render() {
    const {pending, spinnerOptions} = this.props;

    return (
      <Button {...this.props} disabled={pending}>
        {pending ?
          <Spinner {...spinnerOptions}/> :
          null
        }
        {this.props.children}
      </Button>
    );
  }
}

AsyncButton.defaultProps = {
  spinnerOptions: {},
  pending: false
};
