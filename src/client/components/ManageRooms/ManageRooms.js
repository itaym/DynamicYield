import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import {getRooms, addRoom, delRoom} from "../../redux/actions";
import './ManageRooms.css';

class ManageRooms extends PureComponent {

    componentDidMount () {
        const { dispatch, rooms } = this.props;
        !rooms && dispatch(getRooms());
    }

    componentDidUpdate () {
        const { dispatch, rooms } = this.props;
        !rooms && dispatch(getRooms());
    }

    addRoom =() => {
        const { dispatch } = this.props;

        if (!this.name.value) return;

        dispatch(addRoom(this.name.value));
    };
    removeRoom = (name) => {
        return () => {
            const { dispatch } = this.props;
            dispatch(delRoom(name));
        }
    };

    render  () {
        const rooms = this.props.rooms || [];
        const { error } = this.props;

        return (
            <div className={"ManageRooms"}>
                <h2> Conference Rooms </h2>
                <div className={"error"}>{error}</div>
                <div className={"new-room"}>
                    <label htmlFor={"room-name"}>Room name:</label>
                    <input
                        id={"new-room-name"}
                        name={"new-room-name"}
                        autoComplete={'off'}
                        ref={(name) => this.name = name}
                        type={"text"}
                    />

                    <input
                        onClick={this.addRoom}
                        type={"submit"}
                        value={"ADD ROOM"}
                    />
                    <div className={"just-ui-aid"} >&nbsp;</div>
                </div>
                <hr />
                <div className={"rooms-list"}>
                    <div className={"room-line"}>
                        <span>Name</span>
                        <span>Created</span>
                        <span>&nbsp;</span>
                    </div>
                    {rooms.map((room) => {
                        return (
                            <div key={`room_${room._id}`} className={"room-line"}>
                                <span>{room.name}</span>
                                <span>{`${(new Date(room.created)).toLocaleString()} ${(new Date(room.created)).toLocaleTimeString()}`}</span>
                                <span className={'pointer'}><a onClick={this.removeRoom(room.name)}>Remove</a></span>
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

export default connect(mapStateToProps)(ManageRooms);