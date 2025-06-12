import React from "react";
import InternalServerError from "../errorpages/500InternalServerError";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <InternalServerError error={this.state.error?.toString() || ""} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;