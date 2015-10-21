import React from "react";
import {Button, FormField, Radio, Table, Alert} from "elemental";
import extendState from "../../util/extendState";
import jsonDownloadURL from "../../util/jsonDownloadURL";
import request from "superagent";
import requestObservable from "../../util/requestObservable";
let cachedLogs = null;

const withLevel = (level) => (log) => log.level === level;
const filters = {
  info: withLevel("info"),
  warning: withLevel("warning"),
  error: withLevel("error")
};

const tableStyle = {
  maxHeight: 700,
  overflow: "auto",
  marginBottom: 30,
  borderBottom: "1px solid #aaa"
};

const levelColors = {
  info: "#00AA00",
  warning: "#AAAA00",
  error: "#AA0000"
};

const downloadStyle = {
  display: "inline-block"
};

function requestLogs() {
  return requestObservable(request("GET", "/api/logs")).map((res) => res.body.map((log, i) => {
    log.id = i;
    return log;
  }));
}

export default class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      logs: cachedLogs || [],
      filter: null,
      error: null
    };
  }

  componentDidMount() {
    requestLogs().subscribe(
      (logs) => {
        cachedLogs = logs;
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
        {error ? <Alert type="danger"><strong>Error: </strong>{error.message}</Alert> : null}
        <FormField label="Filter">
          <div className="inline-controls">
            <Radio label="all" checked={!filter} onChange={() => this.setFilter(null)}/>
            <Radio label="info" checked={filter === "info"} onChange={() => this.setFilter("info")}/>
            <Radio label="warning" checked={filter === "warning"} onChange={() => this.setFilter("warning")}/>
            <Radio label="error" checked={filter === "error"} onChange={() => this.setFilter("error")}/>
          </div>
        </FormField>
        <Button href={jsonDownloadURL(filteredLogs)} download={`logs-${filter || "all"}-${Date.now()}.json`} style={downloadStyle}>Download</Button>
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
              {filteredLogs.sort((a, b) => b.timestamp - a.timestamp).map(({timestamp, level, message}) => {
                const levelStyle = {
                  color: levelColors[level]
                };
                return (
                  <tr key={`log-${timestamp}`}>
                    <td>{(new Date(timestamp)).toUTCString()}</td>
                    <td style={levelStyle}>{level}</td>
                    <td>{message}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot></tfoot>
          </Table>
        </div>
      </div>
    );
  }
}
