import React, {PureComponent} from 'react';
import {
    Switch,
    Route,
    Link,
    withRouter
} from "react-router-dom";

import Meetings from "../Meetings/Meetings";
import ManageUsers from "../ManageUsers/ManageUsers";
import ManageRooms from "../ManageRooms/ManageRooms";
import "./Main.css"

class Main extends PureComponent {

    render  () {
        return (
            <div className={"Main"}>
                <div className={"left-menu"}>
                    <ul>
                        <li>
                            <Link to={`/`}>Conference Rooms Meetings</Link>
                        </li>
                        <li>
                            <Link to={`/manageUsers`}>Conference Rooms Users</Link>
                        </li>
                        <li>
                            <Link to={`/manageRooms`}>Conference Rooms</Link>
                        </li>
                    </ul>
                </div>
                <div className={"main-container"}>
                    <Switch>
                        <Route path="/ManageUsers">
                            <ManageUsers key={"ManageUsers"} />
                        </Route>
                        <Route path="/ManageRooms">
                            <ManageRooms key={"ManageRooms"} />
                        </Route>
                        <Route path="/">
                            <Meetings key={"Meetings"} />
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withRouter(Main);