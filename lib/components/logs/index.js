import React from "react";
import {Button, FormField, Radio, Table} from "elemental";
import extendState from "../../util/extendState";
import jsonDownloadURL from "../../util/jsonDownloadURL";
import fakeRequest from "../../util/fakeRequest";

const LOGS = [
  {timestamp: Date.now() - 327731, level: "info", message: "System initialized"},
  {timestamp: Date.now() - 318442, level: "info", message: "Downloading data"},
  {timestamp: Date.now() - 248913, level: "info", message: "Scheduling pump job"},
  {timestamp: Date.now() - 901134, level: "warning", message: "Too much jet fuel"},
  {timestamp: Date.now() - 185895, level: "info", message: "Starting pumps"},
  {timestamp: Date.now() - 901836, level: "error", message: "System caught fire"},
  {timestamp: Date.now() - 328937, level: "info", message: "System initialized"},
  {timestamp: Date.now() - 314948, level: "info", message: "Downloading data"},
  {timestamp: Date.now() - 248919, level: "info", message: "Scheduling pump job"},
  {timestamp: Date.now() - 902830, level: "warning", message: "Too much jet fuel"},
  {timestamp: Date.now() - 186411, level: "info", message: "Starting pumps"},
  {timestamp: Date.now() - 908812, level: "error", message: "System caught fire"},
  {timestamp: Date.now() - 324913, level: "info", message: "System initialized"},
  {timestamp: Date.now() - 311914, level: "info", message: "Downloading data"},
  {timestamp: Date.now() - 248915, level: "info", message: "Scheduling pump job"},
  {timestamp: Date.now() - 904816, level: "warning", message: "Too much jet fuel"},
  {timestamp: Date.now() - 186417, level: "info", message: "Starting pumps"},
  {timestamp: Date.now() - 901818, level: "error", message: "System caught fire"},
];

const withLevel = (level) => (log) => log.level === level;
const filters = {
  info: withLevel("info"),
  warning: withLevel("warning"),
  error: withLevel("error"),
  debug: withLevel("debug")
};

const tableStyle = {
  maxHeight: 700,
  overflow: "auto",
  marginBottom: 30
};

function requestLogs() {
  return fakeRequest(10, LOGS);
}

export default class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      logs: [],
      filter: null,
      error: null
    };
  }

  componentDidMount() {
    requestLogs().subscribe(
      (logs) => {
        console.log("got logs", logs);
        extendState(this, {logs, loaded: true});
      },
      (error) => {
        console.log("error", error);
        extendState(this, {error: error, loaded: true})
      }
    );
  }

  setFilter(filterName) {
    extendState(this, {
      filter: filterName
    });
  }

  render() {
    const {loaded, error, logs, filter} = this.state;
    const filteredLogs = filter ? logs.filter(filters[filter]) : logs;

    return (
      <div>
        <FormField label="Filter">
          <div className="inline-controls">
            <Radio label="all" checked={!filter} onChange={() => this.setFilter(null)}/>
            <Radio label="info" checked={filter === "info"} onChange={() => this.setFilter("info")}/>
            <Radio label="warning" checked={filter === "warning"} onChange={() => this.setFilter("warning")}/>
            <Radio label="error" checked={filter === "error"} onChange={() => this.setFilter("error")}/>
            <Radio label="debug" checked={filter === "debug"} onChange={() => this.setFilter("debug")}/>
          </div>
        </FormField>
        <div style={tableStyle}>
          <Table>
            <colgroup>
              <col width="225"/>
              <col width="75"/>
              <col width=""/>
            </colgroup>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Level</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(({timestamp, level, message}) =>
                <tr key={`log-${timestamp}`}>
                  <td>{(new Date(timestamp)).toUTCString()}</td>
                  <td>{level}</td>
                  <td>{message}</td>
                </tr>
              )}
            </tbody>
            <tfoot></tfoot>
          </Table>
        </div>
        <Button href={jsonDownloadURL(filteredLogs)} download={`logs-${filter || "all"}-${Date.now()}.json`}>Download</Button>
      </div>
    );
  }
}
