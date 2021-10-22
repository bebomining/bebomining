import ReactDOM from "react-dom";
import React from "react";

export class Portal extends React.PureComponent {
  state = { domElm: null };

  static getDerivedStateFromProps(props) {
    const domElm = document.querySelector(props.selector);
    return { domElm };
  }

  render() {
    const { domElm } = this.state;

    if (domElm === null) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, domElm);
  }
}
