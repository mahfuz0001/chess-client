import React from "react";
import { Redirect } from "react-router-dom";
import uuid from "uuid/v4";
import { ColorContext } from "../context/colorcontext";
const socket = require("../connection/socket").socket;

class CreateNewGame extends React.Component {
  state = {
    didGetUserName: false,
    inputText: "",
    gameId: "",
  };

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  send = () => {
    const newGameRoomId = uuid();
    this.setState({
      gameId: newGameRoomId,
    });
    socket.emit("createNewGame", newGameRoomId);
  };

  typingUserName = () => {
    const typedText = this.textArea.current.value;
    this.setState({
      inputText: typedText,
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.didGetUserName ? (
          <Redirect to={"/game/" + this.state.gameId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-500">
            <h1 className="text-4xl font-semibold text-white mb-8">
              Your Username:
            </h1>
            <input
              className="mt-4 px-4 py-2 border rounded w-64 text-center"
              ref={this.textArea}
              onInput={this.typingUserName}
              placeholder="Your Username"
            />
            <button
              className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg disabled:opacity-50 shadow-md hover:bg-blue-600"
              disabled={!(this.state.inputText.length > 0)}
              onClick={() => {
                this.props.didRedirect();
                this.props.setUserName(this.state.inputText);
                this.setState({
                  didGetUserName: true,
                });
                this.send();
              }}
            >
              Submit
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const Onboard = (props) => {
  const color = React.useContext(ColorContext);

  return (
    <CreateNewGame
      didRedirect={color.playerDidRedirect}
      setUserName={props.setUserName}
    />
  );
};

export default Onboard;
