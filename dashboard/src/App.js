import React, { Component } from "react";
import { Provider, Client, Connect, query } from "urql";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryZoomContainer,
  VictoryBrushContainer,
  VictoryLegend
} from "victory";

import "./App.css";

const client = new Client({
  url: process.env.REACT_APP_APPSYNC_URL,
  fetchOptions: {
    headers: {
      "X-Api-Key": process.env.REACT_APP_APPSYNC_API_KEY
    }
  }
});

const GetDatapointsQuery = `
query {
  getDatapoints {
    createdAt
    temperature
    pressure
    humidity
  }
}
`;

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleZoom(domain) {
    this.setState({ selectedDomain: domain });
  }

  handleBrush(domain) {
    this.setState({ zoomDomain: domain });
  }

  renderChart = ({ getDatapoints }) => (
    <div>
      <VictoryChart
        width={window.innerWidth}
        height={window.innerHeight - 100}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomContainer
            responsive={false}
            zoomDimension="x"
            zoomDomain={this.state.zoomDomain}
            onZoomDomainChange={this.handleZoom.bind(this)}
          />
        }
      >
        <VictoryLegend
          x={125}
          y={50}
          title="Legend"
          centerTitle
          orientation="horizontal"
          gutter={20}
          style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
          data={[
            { name: "Temperature", symbol: { fill: "tomato" } },
            { name: "Humidity", symbol: { fill: "orange" } }
          ]}
        />

        <VictoryLine
          style={{
            data: { stroke: "tomato" }
          }}
          data={getDatapoints.map(({ createdAt, temperature }) => ({
            x: new Date(createdAt),
            y: temperature / 1000
          }))}
        />

        <VictoryLine
          style={{
            data: { stroke: "orange" }
          }}
          data={getDatapoints.map(({ createdAt, humidity }) => ({
            x: new Date(createdAt),
            y: humidity / 1000
          }))}
        />
      </VictoryChart>

      <VictoryChart
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        width={window.innerWidth}
        height={90}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryBrushContainer
            responsive={false}
            brushDimension="x"
            brushDomain={this.state.selectedDomain}
            onBrushDomainChange={this.handleBrush.bind(this)}
          />
        }
      >
        <VictoryAxis
          tickValues={getDatapoints.map(({ createdAt }) => new Date(createdAt))}
        />
        <VictoryLine
          style={{
            data: { stroke: "tomato" }
          }}
          data={getDatapoints.map(({ createdAt, temperature }) => ({
            x: new Date(createdAt),
            y: temperature / 1000
          }))}
        />
      </VictoryChart>
    </div>
  );

  render() {
    return (
      <Provider client={client}>
        <Connect
          query={query(GetDatapointsQuery)}
          children={({ loaded, data }) => {
            return loaded ? this.renderChart(data) : <div>Loading...</div>;
          }}
        />
      </Provider>
    );
  }
}

export default App;
