import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

class App extends React.Component {
  render() {
    const { dispatch, isAuthenticated } = this.props;

    return (
      <div>
        <div className="wrapper">
          <Container fluid>
            <Navbar
              isAuthenticated={isAuthenticated}
              dispatch={dispatch} />
              {this.props.children}
          </Container>

          <div className="push"></div>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  const { isAuthenticated } = state.auth;

  return { isAuthenticated };
}

export default connect(mapStateToProps)(App);
