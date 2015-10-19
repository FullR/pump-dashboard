import React from "react";
import {Form, FormField, FormInput, FormNote, Button, Label, Checkbox, Alert, Radio} from "elemental";
import {identity, extend} from "lodash";
import IpInput from "./ipInput";
import stateUpdater from "../../util/stateUpdater";
import getEventValue from "../../util/getEventValue";
import extendState from "../../util/extendState";
import request from "superagent";
import requestObservable from "../../util/requestObservable";

let cachedSettings = null;
const getEventOverZero = (event) => Math.max(0, getEventValue(event));

function requestSettings() {
  return requestObservable(request("GET", "/api/settings")).map((res) => res.body);
}

function postSettings(settings) {
  return requestObservable(request("POST", "/api/settings").send(settings));
}

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    if(cachedSettings) {
      this.state = extend({}, cachedSettings, {loading: true, message: null});
    } else {
      this.state = {
        loading: true,
        message: null
      };
    }

    this.update = stateUpdater.many(this, {
      loading: identity,
      dynamic: identity,
      ip: identity,
      subnet: identity,
      gateway: identity,
      closeValvesTimeout: getEventOverZero,
      primeTimeout: getEventOverZero,
      pumpTimeout: getEventOverZero,
      primeDelay: getEventOverZero,
      postPumpValveDelay: getEventOverZero,
      pressureMonitorDelay: getEventOverZero,
      preTideDelay: getEventOverZero
    });

    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    requestSettings().subscribe(
      (settings) => {
        cachedSettings = settings;
        this.setState({
          ...settings,
          loading: false,
          error: null
        });
      },
      (error) => {
        extendState(this, {error, loading: false});
      }
    );
  }

  submit(event) {
    event.preventDefault();
    console.log("Submitting");
    const {dynamic, ip, subnet, gateway, closeValvesTimeout, primeTimeout, pumpTimeout, primeDelay, postPumpValveDelay, pressureMonitorDelay, preTideDelay} = this.state;
    postSettings({dynamic, ip, subnet, gateway, closeValvesTimeout, primeTimeout, pumpTimeout, primeDelay, postPumpValveDelay, pressureMonitorDelay})
      .subscribe(() => {
        this.setState({message: "Settings successfully submitted"});
      }, (error) => {
        console.log("Failed to submit settings:", error);
      });
  }

  render() {
    const {
      loading, error, message,
      dynamic, ip, subnet, gateway,
      closeValvesTimeout, primeTimeout, pumpTimeout,
      primeDelay, pressureMonitorDelay, postPumpValveDelay,
      preTideDelay
    } = this.state;
    const formDisabled = error || loading;
    const {update} = this;

    return (
      <div>
        {error ? <Alert type="danger"><strong>Error: </strong>{error.message || error}</Alert> : null}
        {message ? <Alert type="info">{message}</Alert> : null}
        <Form type="horizontal" onSubmit={this.submit}>
          <FormField label="Network Settings">
            <FormField>
              <div className="inline-controls">
                <Radio label="Static" checked={!dynamic} onChange={() => update.dynamic(false)}/>
                <Radio label="Dynamic" checked={dynamic} onChange={() => update.dynamic(true)}/>
              </div>
            </FormField>
            <IpInput label="Ip Address" disabled={formDisabled || dynamic} value={ip} onChange={update.ip}/>
            <IpInput label="Subnet Mask" disabled={formDisabled || dynamic} value={subnet} onChange={update.subnet}/>
            <IpInput label="Default Gateway" disabled={formDisabled || dynamic} value={gateway} onChange={update.gateway}/>
          </FormField>
          <hr/>
          <FormNote>All times are in milliseconds</FormNote>
          <FormField label="Timeouts">
            <FormField label="Close Valves Timeout" htmlFor="closeValvesTimeout">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="closeValvesTimeout" value={closeValvesTimeout} onChange={update.closeValvesTimeout}/>
            </FormField>
            <FormField label="Prime cycle Timeout" htmlFor="primeTimeout">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="primeTimeout" value={primeTimeout} onChange={update.primeTimeout}/>
            </FormField>
            <FormField label="Pumping Timeout" htmlFor="pumpTimeout">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="pumpTimeout" value={pumpTimeout} onChange={update.pumpTimeout}/>
            </FormField>
          </FormField>
          <hr/>
          <FormField label="Delays">
            <FormField label="Priming Delay" htmlFor="primeDelay">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="primeDelay" value={primeDelay} onChange={update.primeDelay}/>
              <FormNote>How long to wait after closing the valves to start the prime pump</FormNote>
            </FormField>
            <FormField label="Low Pressure Check Delay" htmlFor="pressureMonitorDelay">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="pressureMonitorDelay" value={pressureMonitorDelay} onChange={update.pressureMonitorDelay}/>
              <FormNote>The time between starting the pumps and checking for low pressure</FormNote>
            </FormField>
            <FormField label="Post-pump Delay" htmlFor="postPumpValveDelay">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="postPumpValveDelay" value={postPumpValveDelay} onChange={update.postPumpValveDelay}/>
              <FormNote>How long to wait after filling the tank to close the valves</FormNote>
            </FormField>
            <FormField label="Post-pump Delay" htmlFor="preTideDelay">
              <FormInput type="number" disabled={formDisabled} pattern="[0-9]*" name="preTideDelay" value={preTideDelay} onChange={update.preTideDelay}/>
              <FormNote>How long before the high tide to start the pump process (only in automatic mode)</FormNote>
            </FormField>
          </FormField>

          <Button submit={true} disabled={formDisabled}>Submit</Button>
        </Form>
      </div>
    );
  }
}
