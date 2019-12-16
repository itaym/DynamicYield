import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import {getRooms, selectRoom, getMeetings, addMeeting, delMeeting} from "../../redux/actions";
import DateTime from "../DateTime";
import './Meetings.css';

class Meetings extends PureComponent {

    state = {
        fromTime: new Date(),
        toDate: new Date(),
        description: ''
    };

    componentDidMount () {
        const { dispatch, rooms, meetings, currentRoom} = this.props;
        !rooms && dispatch(getRooms());
        !meetings && currentRoom &&  dispatch(getMeetings(currentRoom.name));
    }

    componentDidUpdate () {
        const { dispatch, rooms, meetings,currentRoom } = this.props;
        !rooms && dispatch(getRooms());
        !meetings && currentRoom && dispatch(getMeetings(currentRoom.name));
    }

    addMeetings =() => {
        const { state, props } = this;
        const { dispatch, currentRoom } = props;
        const { fromTime, toTime, description } = state;

        dispatch(addMeeting(currentRoom.name, fromTime, toTime, description));
    };
    chooseRoom = (room) => {
        return () => {
            const { dispatch } = this.props;
            dispatch(selectRoom(room));
        }
    };
    switchRoom = () => {
        const { dispatch } = this.props;
        dispatch(selectRoom(undefined));
    };

    removeMeeting = (meeting) => {
        return () => {
            const { dispatch, currentRoom } = this.props;
            dispatch(delMeeting(currentRoom.name, meeting.fromTime, meeting.toTime));
        }
    };

    onChangeFromTime = (data) => {
        this.setState((state) => ({...state, fromTime:new Date(data)}));
    };

    onChangeToTime = (data) => {
        this.setState((state) => ({...state, toTime:new Date(data)}));
    };

    onChangeDescription = (event) => {
        let value = event.target.value;
        this.setState((state) => ({...state, description:value}));
    };

    render () {
        const rooms = this.props.rooms || [];
        const meetings = this.props.meetings || [];
        const { currentRoom, error } = this.props;

        const SelectConferenceRoom = (
            <div className={"Meetings"}>
                <h2> Select A Conference Room </h2>
                <div className={"error"}>{error}</div>
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
                                <span className={'pointer'}>{currentRoom !== room ? <a onClick={this.chooseRoom(room)}>Select Me !!!</a> : "SELECTED"}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );

        const NoRooms = (
            <div className={"no-rooms"}>No Conference Rooms. You need to create at least one.</div>
        );

        const ManageMeetings = (
            <div className={"ManageMeetings"}>
                <h2> Meetings Of "{currentRoom ?currentRoom.name : ''}".</h2>
                <h3> <a className={"pointer"} onClick={this.switchRoom}>- - Switch Room - -</a> </h3>
                <div className={"error"}>{error}</div>
                <div className={"new-meeting"}>
                    <label htmlFor={"from-time"}>From time:</label>
                    <DateTime
                        id={"from-time"}
                        name={"from-time"}
                        onChange={this.onChangeFromTime}

                    />
                    <label htmlFor={"to-time"}>Until:</label>
                    <DateTime
                        id={"to-time"}
                        name={"to-time"}
                        onChange={this.onChangeToTime}
                    />
                    <label htmlFor={"description"}>Description:</label>
                    <input
                        id={"description"}
                        name={"description"}
                        autoComplete={'off'}
                        onChange={this.onChangeDescription}
                        type={"text"}
                    />
                    <input
                        onClick={this.addMeetings}
                        type={"submit"}
                        value={"ADD MEETING"}
                    />
                </div>
                <hr />
                <div className={"meeting-list"}>
                    <div className={"meeting-line"}>
                        <span>From time</span>
                        <span>Until</span>
                        <span>Booked by</span>
                        <span>description</span>
                        <span>&nbsp;</span>
                    </div>
                    {meetings.map((meeting) => {
                        return (
                            <div key={`meeting_${meeting._id}`} className={"meeting-line"}>
                                <span>{`${(new Date(meeting.fromTime)).toLocaleString()}`}</span>
                                <span>{`${(new Date(meeting.toTime)).toLocaleString()}`}</span>
                                <span>{meeting.owner}</span>
                                <span>{meeting.description}</span>
                                <span className={"pointer"}><a onClick={this.removeMeeting(meeting)}>Remove</a></span>
                            </div>
                        )
                    })}
                </div>
            </div>
        );

        return !currentRoom ? rooms.length ? SelectConferenceRoom : NoRooms : ManageMeetings;
    }
}

const mapStateToProps = state => {
    return {...state,
        loggedIn: !!state.user
    };
};

export default connect(mapStateToProps)(Meetings);