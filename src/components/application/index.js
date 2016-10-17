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
import ReadableCountdown from "../readable-countdown";
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";

function padNum(n) {
  if(n < 10) return `0${n}`;
  return n;
}

function PumpTime(props) {
  const {pumpTime, onChange, onRemove} = props;
  const now = new Date();
  const {manual} = pumpTime;
  const date = pumpTime.pumpTime;
  if(manual) {
    return (
      <TableRow>
        <TableRowColumn>
          <DatePicker className={cx("date-picker")} id={pumpTime.id + "-date"} value={pumpTime.pumpTime} onChange={onChange} disabled={!pumpTime.manual} minDate={now}/>
        </TableRowColumn>
        <TableRowColumn>
          <TimePicker className={cx("time-picker")} id={pumpTime.id + "-time"} value={pumpTime.pumpTime} onChange={onChange} disabled={!pumpTime.manual} pedantic/>
        </TableRowColumn>
        <TableRowColumn>
          <RaisedButton label="Remove" onClick={onRemove}/>
        </TableRowColumn>
      </TableRow>
    );
  } else {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const ampmHours = (hour % 12) || 12;
    const pm = hour >= 12;
    const minute = date.getMinutes();
    const textStyle = {fontSize: 16};

    return (
      <TableRow>
        <TableRowColumn>
          <span style={textStyle}>{year}-{padNum(month)}-{padNum(day)}</span>
        </TableRowColumn>
        <TableRowColumn>
          <span style={textStyle}>{padNum(ampmHours)}:{padNum(minute)} {pm ? "pm" : "am"}</span>
        </TableRowColumn>
      </TableRow>
    );
  }
}

function shortDateTimeString(date) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function StatusBar({status}) {
  const {state, scheduledPumpDate, manual, error} = status;
  let statusInfo = null;

  switch(state) {
    case "connecting": statusInfo = "Connecting..."; break;
    case "waiting_to_pump": statusInfo = (
      <span>Waiting to pump ({shortDateTimeString(new Date(scheduledPumpDate))}) (<ReadableCountdown date={scheduledPumpDate}/> remaining)</span>
    ); break;
    case "pumping": statusInfo = "Pumping..."; break;
    case "waiting_for_times": statusInfo = "Waiting for manual pump times"; break;
    case "error": statusInfo = `Error: ${error}`; break;
  }

  return (
    <div className={cx("status")}>
      <span className={cx("status-light", `status-light--${status.state}`)}/><span className={cx("status-text")}>{statusInfo}</span>
    </div>
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
    error: null,
    status: {
      state: "connecting",
      scheduledPumpDate: null
    }
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

  handleEnableAutomatic = () => {
    this.closeSaveDialogModal();
    request
      .post("/api/set-automatic")
      .set("Accept", "application/json")
      .end((error) => {
        if(error) {
          console.log(error);
          this.setState({error});
        }
      });
  };

  handleEnableManual = () => {
    this.closeSaveDialogModal();
    request
      .post("/api/set-manual-times")
      .set("Accept", "application/json")
      .send({pumpTimes: this.state.pumpTimes.filter((pumpTime) => pumpTime.manual)})
      .end((error) => {
        if(error) {
          this.setState({error});
        } else {
          this.setState({
            pumpTimes: replaceWhere(this.state.pumpTimes, ({isNew}) => isNew, (pumpTime) => ({
              ...pumpTime,
              isNew: false
            }))
          });
        }
      });
  };

  handleSaveCancel = () => {
    this.setState({saveDialogOpen: false});
  };

  handleStartPump = () => {
    request
      .post("/api/start-pump")
      .end((error) => {
        if(error) this.setState({error});
      });
  };

  handleStopPump = () => {
    request
      .post("/api/stop-pump")
      .end((error) => {
        if(error) this.setState({error});
      });
  };

  requestStatus() {
    request
      .get("/api/status")
      .end((error, res) => {
        if(error) {
          this.setState({
            status: {
              state: "error",
              error
            }
          });
        } else {
          this.setState({
            status: res.body
          });
        }
      });
  }

  closeSaveDialogModal() {
    if(this.state.saveDialogOpen) this.setState({saveDialogOpen: false});
  }

  areManualTimesValid() {
    const now = Date.now();
    const manualPumpTimes = this.state.pumpTimes.filter((pumpTime) => pumpTime.manual);
    return manualPumpTimes.length && manualPumpTimes.every((pumpTime) => pumpTime.pumpTime.getTime() > now);
  }

  componentDidMount() {
    this.statusInterval = setInterval(this.requestStatus.bind(this), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.statusInterval);
  }

  render() {
    const {children, className} = this.props;
    const {loggedIn, pumpTimes, manual, user, saveDialogOpen, status, error} = this.state;

    const classNames = cx(className, "root");

    if(!loggedIn) return (
      <div className={classNames}>
        <LoginForm onSubmit={this.handleLoginSubmit}/>
      </div>
    );
    const visiblePumpTimes = pumpTimes.filter((pumpTime) => !!pumpTime.manual === !!manual);

    return (
      <div className={classNames}>
        <StatusBar status={status}/>
        <div>
          <RaisedButton onClick={this.handleStartPump}>Start Pump Job</RaisedButton>
          <br/>
          <RaisedButton onClick={this.handleStopPump}>Stop Pump Job</RaisedButton>
        </div>

        <Checkbox label="Manual Scheduling Mode" onCheck={this.handleManualChange} checked={manual}/>
        <div className={cx("button-container")}>
          {manual ?
            <RaisedButton label="Add" onClick={this.handleAddDate}/> :
            null
          }
          {manual || status.manual !== manual ?
            <RaisedButton label="Save" onClick={this.handleSave} disabled={manual && !this.areManualTimesValid()}/> :
            null
          }
        </div>

        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Date</TableHeaderColumn>
              <TableHeaderColumn>Time</TableHeaderColumn>
              {manual ? <TableHeaderColumn>Remove</TableHeaderColumn> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePumpTimes.map((pumpTime) =>
              <PumpTime key={pumpTime.id}
                pumpTime={pumpTime}
                onChange={this.handleChangeManualDate.bind(this, pumpTime.id)}
                onRemove={this.handleRemoveDate.bind(this, pumpTime.id)}
              />
            )}
          </TableBody>
        </Table>

        <Dialog
          actions={[
            <FlatButton label="Cancel" onClick={this.handleSaveCancel}/>,
            <FlatButton label="Confirm" onClick={manual ? this.handleEnableManual : this.handleEnableAutomatic}/>
          ]}
          open={saveDialogOpen}
          title={`Switching to ${manual ? "manual" : "automatic"} scheduling mode`}
          modal
        >
          Are you sure you want the server to run in {manual ? "manual" : "automatic"} mode?
        </Dialog>
      </div>
    );
  }
}
