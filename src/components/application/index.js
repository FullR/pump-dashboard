import React, {PropTypes} from "react";
import cx from "./style.css";
import request from "superagent";
import LoginForm from "../login-form";
import Checkbox from "material-ui/Checkbox";
import replaceWhere from "util/replace-where";
import DatePicker from "material-ui/DatePicker";
import TimePicker from "material-ui/TimePicker";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import Dialog from "material-ui/Dialog";

function PumpTime(props) {
  const {pumpTime, onChange, onRemove} = props;
  const now = new Date();
  return (
    <tr>
      <td>
        <DatePicker id={pumpTime.id + "-date"} value={pumpTime.pumpTime} onChange={onChange} disabled={!pumpTime.manual} minDate={now}/>
      </td>
      <td>
        <TimePicker id={pumpTime.id + "-time"} value={pumpTime.pumpTime} onChange={onChange} disabled={!pumpTime.manual} pedantic/>
      </td>
      {pumpTime.manual ?
        <td><RaisedButton label="Remove" onClick={onRemove}/></td> :
        null
      }
    </tr>
  );
}

let newPumpTimeIdCounter = 0;
function newPumpTimeId() {
  return `new-${newPumpTimeIdCounter++}`;
}

export default class Application extends React.Component {
  state = {
    saveDialogOpen: false,
    loggedIn: false,
    pumpTimes: [],
    manual: false,
    user: null,
    error: null
  };

  handleLoginSubmit = ({username, password}) => {
    request
      .post("/api/login")
      .set("Accept", "application/json")
      .send({username, password})
      .end((error, res) => {
        if(error) {
          this.setState({error, user: null, loggedIn: false});
        } else {
          this.setState({
            error: null,
            user: res.body.user,
            pumpTimes: res.body.pumpTimes.map((pumpTime) => ({
              ...pumpTime,
              pumpTime: new Date(pumpTime.pumpTime)
            })),
            manual: res.body.manual,
            loggedIn: true
          });
        }
      });
  };

  handleManualChange = (e, checked) => this.setState({manual: checked});

  handleChangeManualDate = (pumpTimeId, e, newDate) => this.setState({
    pumpTimes: replaceWhere(this.state.pumpTimes,
      (pumpTime) => pumpTime.id === pumpTimeId,
      (pumpTime) => ({
        ...pumpTime,
        pumpTime: newDate
      })
    )
  });

  handleRemoveDate = (pumpTimeId) => this.setState({
    pumpTimes: this.state.pumpTimes.filter((pumpTime) => pumpTime.id !== pumpTimeId)
  });

  handleAddDate = () => this.setState({
    pumpTimes: [...this.state.pumpTimes, {
      isNew: true,
      id: newPumpTimeId(),
      pumpTime: new Date(),
      manual: true
    }]
  });

  handleSave = () => {
    this.setState({saveDialogOpen: true});
  };

  handleSaveConfirm = () => {
    this.setState({saveDialogOpen: false});
    request
      .post("/api/set-manual-times")
      .set("Accept", "application/json")
      .send({pumpTimes: this.state.pumpTimes.filter((pumpTime) => pumpTime.manual)})
      .end((error) => {
        if(error) {
          console.log(error);
          this.setState({error});
        }
      });
  };

  handleSaveCancel = () => {
    this.setState({saveDialogOpen: false});
  };

  areManualTimesValid() {
    const now = Date.now();
    const manualPumpTimes = this.state.pumpTimes.filter((pumpTime) => pumpTime.manual);
    return manualPumpTimes.length && manualPumpTimes.every((pumpTime) => pumpTime.pumpTime.getTime() > now);
  }

  render() {
    const {children, className} = this.props;
    const {loggedIn, pumpTimes, manual, user, saveDialogOpen, error} = this.state;

    const classNames = cx(className, "root");

    if(!loggedIn) return (
      <LoginForm onSubmit={this.handleLoginSubmit}/>
    );
    const visiblePumpTimes = pumpTimes.filter((pumpTime) => !!pumpTime.manual === !!manual);

    return (
      <div className={classNames}>
        <Checkbox label="Manual Scheduling Mode" onCheck={this.handleManualChange} checked={manual}/>
        <table>
          <tbody>
            {visiblePumpTimes.map((pumpTime) =>
              <PumpTime key={pumpTime.id}
                pumpTime={pumpTime}
                onChange={this.handleChangeManualDate.bind(this, pumpTime.id)}
                onRemove={this.handleRemoveDate.bind(this, pumpTime.id)}
              />
            )}
          </tbody>
        </table>

        {manual ?
          <RaisedButton label="Add" onClick={this.handleAddDate}/> :
          null
        }

        {manual ?
          <RaisedButton label="Save" onClick={this.handleSave} disabled={!this.areManualTimesValid()}/> :
          null
        }

        <Dialog
          actions={[
            <FlatButton label="Cancel" onClick={this.handleSaveCancel}/>,
            <FlatButton label="Confirm" onClick={this.handleSaveConfirm}/>
          ]}
          open={saveDialogOpen}
          title="Switching to manual scheduling mode"
          modal
        >
          Are you sure? By saving, the system will switch to manual mode and will only pump at the times specified.
        </Dialog>

      </div>
    );
  }
}
