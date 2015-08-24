import React from "react";
import {Button, FormField, Radio, Table} from "elemental";
import extendState from "../../util/extendState";
import jsonDownloadURL from "../../util/jsonDownloadURL";
import fakeRequest from "../../util/fakeRequest";

const LOGS = [
  {timestamp: Date.now() - 328932, level: "info", message: "System initialized"},
  {timestamp: Date.now() - 318947, level: "info", message: "Downloading data"},
  {timestamp: Date.now() - 248914, level: "info", message: "Scheduling pump job"},
  {timestamp: Date.now() - 90183, level: "warning", message: "Too much jet fuel"},
  {timestamp: Date.now() - 183492, level: "info", message: "Starting pumps"},
  {timestamp: Date.now() - 90183, level: "error", message: "System caught fire"},
  {timestamp: Date.now() - 328932, level: "info", message: "System initialized"},
  {timestamp: Date.now() - 318947, level: "info", message: "Downloading data"},
  {timestamp: Date.now() - 248914, level: "info", message: "Scheduling pump job"},
  {timestamp: Date.now() - 90183, level: "warning", message: "Too much jet fuel"},
  {timestamp: Date.now() - 183492, level: "info", message: "Starting pumps"},
  {timestamp: Date.now() - 90183, level: "error", message: "System caught fire"},
  {timestamp: Date.now() - 328932, level: "info", message: "System initialized"},
  {timestamp: Date.now() - 318947, level: "info", message: "Downloading data"},
  {timestamp: Date.now() - 248914, level: "info", message: "Scheduling pump job"},
  {timestamp: Date.now() - 90183, level: "warning", message: "Too much jet fuel"},
  {timestamp: Date.now() - 183492, level: "info", message: "Starting pumps"},
  {timestamp: Date.now() - 90183, level: "error", message: "System caught fire"},
];

const withLevel = (level) => (log) => log.level === level;
const filters = {
  info: withLevel("info"),
  warning: withLevel("warning"),
  error: withLevel("error")
};

const tableStyle = {
  maxHeight: 700,
  overflow: "auto",
  marginBottom: 30
};

function requestLogs() {
  return fakeRequest(2000, LOGS);
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
            <Radio label="all" checked={!filter} onClick={() => this.setFilter(null)}/>
            <Radio label="info" checked={filter === "info"} onClick={() => this.setFilter("info")}/>
            <Radio label="warning" checked={filter === "warning"} onClick={() => this.setFilter("warning")}/>
            <Radio label="error" checked={filter === "error"} onClick={() => this.setFilter("error")}/>
          </div>
        </FormField>
        <div style={tableStyle}>
          <Table>
            <colgroup>
              <col width="150"/>
              <col width="100"/>
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
                <tr>
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
