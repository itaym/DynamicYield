import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import {getUsers, addUser, delUser} from "../../redux/actions";
import './ManageUsers.css';

class ManageUsers extends PureComponent {

    componentDidMount () {
        const { dispatch, users } = this.props;
        !users && dispatch(getUsers());
    }

    componentDidUpdate () {
        const { dispatch, users } = this.props;
        !users && dispatch(getUsers());
    }

    addUser =() => {
        const { dispatch } = this.props;

        if (!this.name.value || !this.password.value) return;
        if (this.verify.value !== this.password.value) {
            alert("Password is not verified correctly");
            return;
        }
        dispatch(addUser(this.name.value, this.password.value));
    };
    removeUser = (name) => {
        return () => {
            const { dispatch } = this.props;
            dispatch(delUser(name));
        }
    };

    render  () {
        const users = this.props.users || [];
        const { error } = this.props;

        return (
            <div className={"ManageUsers"}>
                <h2> Conference Rooms Users </h2>
                <div className={"error"}>{error}</div>
                <div className={"new-user"}>
                    <label htmlFor={"username"}>User name:</label>
                    <input
                        id={"new-username"}
                        name={"new-username"}
                        autoComplete={'off'}
                        ref={(name) => this.name = name}
                        type={"text"}
                    />
                    <label htmlFor={"password"}>Password:</label>
                    <input
                        id={"new-password"}
                        name={"new-password"}
                        autoComplete={'off'}
                        ref={(password) => this.password = password}
                        type={"password"}
                    />
                    <label htmlFor={"verify"}>Confirm:</label>
                    <input
                        id={"verify"}
                        name={"verify"}
                        autoComplete={'off'}
                        ref={(verify) => this.verify = verify}
                        type={"password"}
                    />
                    <input
                        onClick={this.addUser}
                        type={"submit"}
                        value={"ADD USER"}
                    />
                </div>
                <hr />
                <div className={"users-list"}>
                    <div className={"user-line"}>
                        <span>Name</span>
                        <span>Last Login</span>
                        <span>Created</span>
                        <span>&nbsp;</span>
                    </div>
                {users.map((user) => {
                    return (
                        <div key={`user_${user._id}`} className={"user-line"}>
                            <span>{user.name}</span>
                            <span>{user.lastLogin ? `${(new Date(user.lastLogin)).toLocaleString()}` : "NEVER"}</span>
                            <span>{`${(new Date(user.created)).toLocaleString()}`}</span>
                            <span className={""}><a onClick={this.removeUser(user.name)}>Remove</a></span>
                        </div>
                    )
                })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {...state,
        loggedIn: !!state.user
    };
};

export default connect(mapStateToProps)(ManageUsers);