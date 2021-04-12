/*
 * Copyright (C) 2021 Hal Perkins.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Winter Quarter 2021 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

import React, {Component} from 'react';
import Map from "./Map";
import ChoicesList from "./ChoicesList";

interface AppState {
    buildingList: []
    shortestPath: []
    start: string
    destination: string
    drawPathPermission: boolean
}

interface Path {
    path: []
}

// An app where users can find the shortest path between two buildings on UW campus.
// Once the valid buildings are selected and the user click the button to find the shortest path,
// the corresponding path will be displayed on the screen, connecting the two buildings with
// a purple curve. The user can also reset the options and clean the map by clicking the Clear button.
class App extends Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            buildingList: [],
            shortestPath: [],
            start: "",
            destination: "",
            drawPathPermission: false,
        };
    }

    // load the building list at the beginning
    componentDidMount() {
        this.requestBuildingList();
    }

    requestBuildingList = async () => {
        try {
            let responsePromise = fetch("http://localhost:4567/building-list?");
            let response = await responsePromise;

            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return; // Stop the execution if the response is bad.
            }

            let buildingList = (await response.json()) as [];
            this.setState({
                buildingList: buildingList
            })
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    }

    requestFindPath = async () => {
        try {
            let responsePromise = fetch("http://localhost:4567/find-path?start=" + this.state.start +
                    "&destination=" + this.state.destination);
            let response = await responsePromise;// get the json string for Path<Point>

            if (!response.ok) {
                alert("The status is wrong! Expected: 200, Was: " + response.status);
                return; // Stop the execution if the response is bad.
            }

            let shortestPath = (await response.json()) as Path;// turn the string into Path<Point>


            this.setState({
                shortestPath: shortestPath.path// set the shortestPath to be a list of Segment
            });

            this.setState({
                drawPathPermission: true
            })
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    }

    setStart = (newStart: string) => {

        // Turn off the drawPathPermission before updating components(where doDrawPath might
        // automatically get called unless permission denied before hand.)
        this.setState({
            drawPathPermission: false
        });

        // Set "this.state.start" for future use.
        // (Note: requestFindPath() must have the most recent this.start & this.destination to get
        // our desired most up-to-date path!)
        this.setState ({
            start: newStart
        });
    }

    setDestination = (newDestination: string) => {

        // Turn off the drawPathPermission before updating components(where doDrawPath might
        // automatically get called unless permission denied before hand.)
        this.setState({
            drawPathPermission: false
        });

        // Set "this.state.destination" for future use.
        // (Note: requestFindPath() must have the most recent this.start & this.destination to get
        // our desired most up-to-date path!)
        this.setState({
            destination: newDestination
        });
    }

    reset = () => {
        this.setState ({
            buildingList: [],
            shortestPath: [],
            start: "",
            destination: "",
            drawPathPermission: false,
        });
        this.requestBuildingList();// must always preserve the building list
    }

    drawPath = () => {
        this.requestFindPath();
    }

    resetPermission = (drawnSignal: boolean) => {
        if (drawnSignal) {
            this.setState({
                drawPathPermission: false
            });
        }
    }

    render() {
        return (
            <div>
                <Map currentPath={this.state.shortestPath} permissionToDraw={this.state.drawPathPermission}
                     resetPermission={this.resetPermission}/>
                <button onClick={() => this.drawPath()}>Find The Shortest Path!</button>

                <ChoicesList buildingChoices={this.state.buildingList} setStart={this.setStart}
                setDestination={this.setDestination} clearButton={this.reset}/>
            </div>
        );
    }
}

export default App;
