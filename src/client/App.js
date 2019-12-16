import React, { Component } from 'react';
import './app.css';
import { connect } from 'react-redux';
import Header from './components/Header/Header';
import SignIn from './components/SignIn/SignIn';
import Main from './components/Main/Main';
import { isLoggedIn } from './actions';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

class App extends Component {

    doIsLoggedIn = () => {
        const { dispatch } = this.props;
        dispatch(isLoggedIn());
    };

    componentDidMount() {
        this.doIsLoggedIn();
    }

    render() {
        //const { username } = this.props.user.name;
        const { loggedIn } = this.props;

        return !loggedIn ?
            ([
                    <Header key={"1"} />,
                    <SignIn
                        key={"2"}
                        to={{
                            pathname: "/SignIn",
                            state: {from: location}
                        }}
                    />]
            )
            :
            (
                <Router>
                    <Switch>
                        <Route path="/*">
                            <Header />
                            <Main />
                        </Route>
                    </Switch>
                </Router>
            );
    }
}

const mapStateToProps = state => {
    return {...state,
        loggedIn: !!state.user
    };
};

export default connect(mapStateToProps)(App)
