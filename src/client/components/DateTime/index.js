import React, {PureComponent} from 'react';
import "./DateTime.css";

class DateTime extends PureComponent {

    onDateChange = () => {
        const { props } = this;
        const { onChange } = props;

        try {
            let date = this.date.value + ' ' + this.time.value;
            date = new Date(date);

            if (onChange) {
                onChange(date)
            }
        }
        catch (e) {}
    };

    render  () {
        return (
            <div className={"DateTime"}>
                <input ref={(date) => this.date = date} type={"date"} onChange={this.onDateChange} />&nbsp;<input ref={(time) => this.time = time} type={"time"} onChange={this.onDateChange} />
            </div>
        );
    }
}

export default DateTime;