import React from "react";
import { Container } from "./Container";
import { HelpDesk } from "./HelpDesk";

export default class ErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error: Error | null; errorInfo: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service

    this.setState({ hasError: this.state.hasError, error, errorInfo });
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <Container>
            <h1>Something went terribly wrong.</h1>
          </Container>
          <Container>
            <HelpDesk
              hdData={() => {
                const result: { stack?: any; error?: any } = {
                  stack: undefined,
                  error: undefined,
                };
                if (this.state.errorInfo) {
                  result.stack = this.state.errorInfo.componentStack;
                }
                if (this.state.error) {
                  result.error = this.state.error;
                }
                return result;
              }}
            ></HelpDesk>
          </Container>
          <Container>
            <h2 className="is-2 is-title">Error Stack</h2>
            <pre>
              <code>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </code>
            </pre>
            <h2 className="is-2 is-title">Error</h2>
            <pre>
              <code>{this.state.error && this.state.error.toString()}</code>
            </pre>
          </Container>
          <Container>
            <div className="content">
              <p>
                Zurück <a href="/">zum Anfang </a>
              </p>
            </div>
          </Container>
        </>
      );
    }

    return this.props.children;
  }
}
