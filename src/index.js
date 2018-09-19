import React from "react";
import ReactDOM from "react-dom";
import InputRange from "react-input-range";
import { Howl, Howler } from "howler";

import "react-input-range/lib/css/index.css";

class Keyboard extends React.Component {
  state = {
    duration: 0,
    sliderValue: {
      min: 0,
      max: 0
    },
    sprites: {}
  };

  constructor(props) {
    super(props);

    this.audioFile = {};
    this.loadedAudio = null;
  }

  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const data = reader.result;

      this.audioFile = {
        src: data,
        format: file.name
          .split(".")
          .pop()
          .toLowerCase()
      };

      this.loadedAudio = new Howl({
        ...this.audioFile,
        onload: () => {
          this.setState({ duration: this.loadedAudio.duration() });
        }
      });
    });

    reader.readAsDataURL(file);
  };

  play = key => {
    this.loadedAudio.stop();
    this.loadedAudio.play(key);
  };

  addKey = event => {
    event.preventDefault();

    const key = event.target.key.value;
    const keySettings = {
      [key]: {
        label: event.target.label.value,
        start: this.state.sliderValue.min,
        end: this.state.sliderValue.max
      }
    };

    this.setState({
      sprites: {
        ...this.state.sprites,
        ...keySettings
      }
    }, () => {
      const sprite = {};
      Object.keys(this.state.sprites).map((item) => {
        const currentSprite = this.state.sprites[item];
        const delay = currentSprite.end - currentSprite.start;
        sprite[item] = [this.state.sprites[item].start * 1000, delay * 1000];
      });

      this.loadedAudio = new Howl({
        ...this.audioFile,
        sprite,
      });
    });

    document.addEventListener("keypress", event => {
      if (event.key !== key) {
        return;
      }

      this.play(key);
    });
  };

  render() {
    const buttons = Object.keys(this.state.sprites);
    return (
      <div>
        <input type="file" name="musica" onChange={this.handleChange} />

        {this.state.duration > 0 && (
          <div>
            <br />
            <br />
            <br />
            <form onSubmit={this.addKey}>
              <input name="key" placeholder="tecla" maxLength={1} />
              <input name="label" placeholder="legenda" />
              <button>vai!</button>
            </form>
            <br />
            <br />
            <br />
            <InputRange
              draggableTrack
              minValue={0}
              maxValue={this.state.duration}
              onChange={value => this.setState({ sliderValue: value })}
              value={this.state.sliderValue}
            />
          </div>
        )}

        <br />
        <br />
        <br />

        <div>
          {buttons.map((key, i) => {
            const currentButton = this.state.sprites[key];

            return (
              <button key={i} onClick={() => this.play(key)}>
                {key}: {currentButton.start} ~ {currentButton.end}
              </button>
            )
          })}
        </div>
      </div>
    );
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<Keyboard />, mountNode);
