import React, {PureComponent} from 'react';
import './Header.css';

import { connect } from 'react-redux';
import { doLogout } from '../../redux/actions';

class Header extends PureComponent {

    doLogout = () => {
        const { dispatch } = this.props;
        const { user } = this.props;
        console.log(user);
        dispatch(doLogout());
    };

    render () {
        const { user } = this.props;
        return (
            <div className={"Header"}>
                {user ? `Hello ${user.name}` : null}
                <input
                    id={"doLogout"}
                    onClick={this.doLogout}
                    type={"submit"}
                    value={"Logout"}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {...state,
        loggedIn: !!state.user
    };
};

export default connect(mapStateToProps)(Header);