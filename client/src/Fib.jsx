import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seen: [],
    values: {},
    index: ""
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    try {
      const values = await axios.get("/api/values/current");
      this.setState({ values: values.data });
    } catch (error) {
      console.log(error);
    }
  }

  async fetchIndexes() {
    try {
      const seen = await axios.get("/api/values/all");
      this.setState({ seen: seen.data });
    } catch (error) {
      console.log(error);
    }
  }

  handleSubmit = async event => {
    event.preventDefault();
    const { index } = this.state;
    await axios.post("/api/values", {
      index
    });
    this.setState({ index: "" });
  };

  renderSeen() {
    const { seen } = this.state;
    return seen.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const { values } = this.state;
    return Object.entries(values).map(([key, value]) => (
      <div key={key}>
        For index {key} I calculated {value}
      </div>
    ));
  }

  render() {
    const { index } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index:</label>
          <input
            value={index}
            type="text"
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>
        <h3>Indexes I have seen:</h3>
        {this.renderSeen()}
        <h3>Calculated Values:</h3>
        {this.renderValues()}
      </div>
    );
  }
}

export default Fib;
