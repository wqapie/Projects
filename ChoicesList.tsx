import React, {Component} from 'react';

interface ChoicesListProps {
    buildingChoices: [];
    setStart (currentStart: string): void;
    setDestination (currentDest: string): void;
    clearButton (): void;
}

interface ChoicesListState {
    currentStart: string;
    currentDest: string;
}

// ChoiceList is responsible for updating the user's choices of start and destination
// by clicking on a dropdown list.
class ChoicesList extends Component<ChoicesListProps, ChoicesListState> {

    constructor(props: ChoicesListProps) {
        super(props);
        this.state = {
            currentStart: "",
            currentDest: "",
        }
    }

    onStartChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selection = event.target.value;
        this.props.setStart(selection);
    }

    onDestChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        let selection = event.target.value;
        this.props.setDestination(selection);
    }

    render() {
        const choices = this.props.buildingChoices;
        const listOfChoices = [];

        listOfChoices.push(<option key={null} value='null' >Please Select...</option>)
        for (let choice of choices) {
            listOfChoices.push(<option key={choice} value={choice}>{choice}</option>);// initialize a list of short names
        }

        return (
            <div id="choice-list">
                <label> Select Start: </label>
                <select name={this.state.currentStart} id={"start"}
                        onChange={this.onStartChange}>
                    <optgroup label={"Start"}>
                        {listOfChoices}
                    </optgroup>
                </select>

                <label> Select Destination: </label>
                <select name={this.state.currentDest} id={"destination"}
                        onChange={this.onDestChange}>
                    <optgroup label={"Destination"}>
                        {listOfChoices}
                    </optgroup>
                </select>
                <div>
                    <button onClick={this.props.clearButton}>Clear</button>
                </div>
            </div>
        );
    }
}

export default ChoicesList;