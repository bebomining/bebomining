import React from "react";
import { Portal } from "./../Portal/Portal";
export class NotificationsPortal extends React.PureComponent {
  render() {
    const { children, selector } = this.props;
    return <Portal selector={selector}>{children}</Portal>;
  }
}
