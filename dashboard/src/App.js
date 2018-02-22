import React, { Component } from "react";
import { Provider, Client, Connect, query } from "urql";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryZoomContainer, VictoryBrushContainer } from "victory";

import "./App.css";

const client = new Client({
  url:
    "https://fv7sdsp65jev3ijlmwkbpiiawm.appsync-api.us-east-1.amazonaws.com/graphql",
  fetchOptions: {
    headers: {
      "X-Api-Key": process.env.REACT_APP_APPSYNC_API_KEY,
    }
  }
});

const GetDatapointsQuery = `
query {
  getDatapoints {
    createdAt
    temperature
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

  renderChart({ getDatapoints }) {
    return (
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
          <VictoryLine
            style={{
              data: { stroke: "tomato" }
            }}
            data={
              getDatapoints.map(({ createdAt, temperature}) => ({
                x: new Date(createdAt),
                y: temperature,
              }))
            }
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
            tickValues={ getDatapoints.map(({ createdAt }) => (new Date(createdAt))) }

          />
          <VictoryLine
            style={{
              data: { stroke: "tomato" }
            }}
            data={getDatapoints.map(({ createdAt, temperature}) => ({
              x: new Date(createdAt),
              y: temperature,
            }))}
          />
        </VictoryChart>
      </div>
    );
  }

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
