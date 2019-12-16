import React, {PureComponent} from 'react';
import './SignIn.css';

import { connect } from 'react-redux';
import { doLogin } from '../../redux/actions';

class SignIn extends PureComponent {

    doLogin = () => {
        const { dispatch } = this.props;

        if (!this.name.value || !this.password.value) return;

        dispatch(doLogin(this.name.value, this.password.value));
    };

    render () {
        const { error } = this.props;
        return (
            <div className={"SignIn"}>
                <div className={"error"}>{error}</div>
                <label htmlFor={"username"}>User name:</label>
                <input
                    id={"username"}
                    name={"username"}
                    ref={(name) => this.name = name}
                    type={"text"}
                    />
                <label htmlFor={"password"}>Password:</label>
                <input
                    id={"password"}
                    name={"password"}
                    ref={(password) => this.password = password}
                    type={"password"}
                />
                <input
                    onClick={this.doLogin}
                    type={"submit"}
                    value={"SIGN IN"}
                />
                <br />
                <hr />
                <br />
                <pre>
                    The default user to login with is configured in the project Settings.js ...
                </pre>
                <hr />
                <pre>
                    I did the minimal UI needed. I'm sorry for the delay, I had a busy week.
                    I started to implement this exam on Wednesday afternoon. So it was tied.
                    Any way here it is..

                    Have fun
                </pre>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {...state,
        loggedIn: !!state.user
    };
};

export default connect(mapStateToProps)(SignIn);