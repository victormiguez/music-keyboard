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

    // this.audioEl = null;
    this.audioFile = {};
    this.loadedAudio = null;
  }

  handleChange = e => {
    const file = e.target.files[0];
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
      // setTimeout(() => {
      //   console.log(music.duration());
      //   this.setState({ duration: music.duration() }, () => {
      //     console.log(this.state);
      //   });
      // }, 50);
    });

    reader.readAsDataURL(file);
  };

  play = key => {
    // console.log(this.foo);
    // this.foo.pause();
    this.foo.play("foo");
    // console.log(key);
    // const delay = key.end - key.start;
    // this.audioEl.currentTime = key.start;
    // this.audioEl.play();

    // setTimeout(() => {
    //   this.audioEl.pause();
    // }, delay * 1000);
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
    });

    // // Create a Howler sound
    // this.foo = new Howl({});

    document.addEventListener("keypress", event => {
      if (event.key !== key) {
        return;
      }

      this.play(keySettings);
    });
  };

  render() {
    return (
      <div>
        <input type="file" name="musica" onChange={this.handleChange} />
        {/* <audio
          id="sound"
          controls
          ref={q => {
            this.audioEl = q;
          }}
        /> */}

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

        {/* <div>
          <button onClick={() => this.play()}>aaa</button>
          {this.state.sprites.map((key, i) => (
            <button key={i} onClick={() => this.play(key)}>
              {key.key}: {key.start} ~ {key.end}
            </button>
          ))}
        </div> */}
      </div>
    );
  }
}

var mountNode = document.getElementById("app");
ReactDOM.render(<Keyboard />, mountNode);
