import React from 'react';
import { Container } from './Container';
import { Link } from 'react-router-dom';

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
            <h2 className='is-2 is-title'>Error Stack</h2>
            <pre>
              <code>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </code>
            </pre>
            <h2 className='is-2 is-title'>Error</h2>
            <pre>
              <code>{this.state.error && this.state.error.toString()}</code>
            </pre>
          </Container>
          <Container>
            <div className='content'>
              <p>
                Zurück <Link to='/'>zum Anfang </Link>
              </p>
            </div>
          </Container>
        </>
      );
    }

    return this.props.children;
  }
}
