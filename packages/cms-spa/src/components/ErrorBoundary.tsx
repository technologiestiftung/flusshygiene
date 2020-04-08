import React from "react";
import { Container } from "./Container";
import { HelpDesk } from "./HelpDesk";
// import { Auth0Context } from "../lib/auth/react-auth0-wrapper";
import {
  ProvideCombindeContext,
  CombinedContext,
} from "../contexts/error-boundary-combined-contexts";
import { MessageProvider } from "../contexts/messages";

export const WrapErrorBoundary = (props) => {
  return (
    <ProvideCombindeContext>
      <ErrorBoundary {...props} />
    </ProvideCombindeContext>
  );
};
export default class ErrorBoundary extends React.Component<
  {},
  { hasError: boolean; error: Error | null; errorInfo: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static contextType = CombinedContext;
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidMount() {
    // eslint-disable-next-line no-console
    // console.log("Context=" + JSON.stringify(this.context));
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service

    this.setState({ hasError: this.state.hasError, error, errorInfo });
    console.error(error, errorInfo);
  }
  render() {
    const { isAuthenticated } = this.context.authContext;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { spot } = this.context.helpDeskContext;

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <MessageProvider>
            <Container columnClassName="is-8">
              <h1>Irgendwas ist schief gelaufen.</h1>
              <div className="content">
                <p>
                  Bitte beschreiben sie, so gut es geht, wie der Fehler
                  entstanden ist.
                </p>
              </div>
            </Container>
            <Container columnClassName="is-8">
              {isAuthenticated === true ? (
                <HelpDesk
                  hdData={{
                    error: this.state.error ? this.state.error : undefined,
                    componentStack: this.state.errorInfo
                      ? this.state.errorInfo?.componentStack
                      : this.state.errorInfo,
                  }}
                ></HelpDesk>
              ) : (
                <>
                  <h2 className="is-2 is-title">Error Stack</h2>
                  <pre>
                    <code>
                      {this.state.errorInfo &&
                        this.state.errorInfo.componentStack}
                    </code>
                  </pre>
                  <h2 className="is-2 is-title">Error</h2>
                  <pre>
                    <code>
                      {this.state.error && this.state.error.toString()}
                    </code>
                  </pre>
                </>
              )}
            </Container>
            <Container columnClassName="is-8">
              <div className="content">
                <p>
                  Zurück <a href="/">zum Anfang </a>
                </p>
              </div>
            </Container>
          </MessageProvider>
        </>
      );
    }

    return this.props.children;
  }
}
