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
import "./Map.css";

interface MapState {
    backgroundImage: HTMLImageElement | null;
}

interface MapProps {
    currentPath: Segment[]
    permissionToDraw: boolean
    resetPermission (drawnSignal: boolean): void
}

interface Segment {
    start: Point,
    end: Point,
}

interface Point {
    x: number,
    y: number,
}

// Map is responsible for all the visualization stuffs.
class Map extends Component<MapProps, MapState> {

    // NOTE:
    // This component is a suggestion for you to use, if you would like to.
    // It has some skeleton code that helps set up some of the more difficult parts
    // of getting <canvas> elements to display nicely with large images.
    //
    // If you don't want to use this component, you're free to delete it.

    canvas: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapProps) {
        super(props);
        this.state = {
            backgroundImage: null
        };
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.fetchAndSaveImage();
        this.drawBackgroundImage();
    }

    componentDidUpdate() {
        // Not only ensure the background map always exist, but also enable a
        // "clean map" whenever a new start/destination is chosen.
        this.drawBackgroundImage();

        // Every time check whether the App has given Map the permission to draw paths
        if (this.props.permissionToDraw) {
            this.doDrawPath(this.props.currentPath);
        }
    }

    fetchAndSaveImage() {
        // Creates an Image object, and sets a callback function
        // for when the image is done loading (it might take a while).
        let background: HTMLImageElement = new Image();
        background.onload = () => {
            this.setState({
                backgroundImage: background
            });
        };
        // Once our callback is set up, we tell the image what file it should
        // load from. This also triggers the loading process.
        background.src = "./campus_map.jpg";
    }


    drawBackgroundImage() {
        let canvas = this.canvas.current;
        if (canvas === null) throw Error("Unable to draw, no canvas ref.");
        let ctx = canvas.getContext("2d");
        if (ctx === null) throw Error("Unable to draw, no valid graphics context.");
        //
        if (this.state.backgroundImage !== null) { // This means the image has been loaded.
            // Sets the internal "drawing space" of the canvas to have the correct size.
            // This helps the canvas not be blurry.
            canvas.width = this.state.backgroundImage.width;
            canvas.height = this.state.backgroundImage.height;
            ctx.drawImage(this.state.backgroundImage, 0, 0);
        }
    }

    doDrawPath = (paths: Segment[]) => {
        if (this.canvas.current === null) {
            throw new Error("Unable to access canvas.");
        }
        const ctx = this.canvas.current.getContext('2d');
        if (ctx === null) {
            throw new Error("Unable to create canvas drawing context.");
        }
        if (paths === null) {
            throw new Error("path does not exist:(")
        }

        // cumulatively draw the path
        for (let path of paths) {
            this.drawSegment(ctx, path);
        }
    }

    drawSegment = (ctx: CanvasRenderingContext2D, path: Segment) => {
        ctx.beginPath();
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 10;
        ctx.moveTo(path.start.x, path.start.y);
        ctx.lineTo(path.end.x, path.end.y);
        ctx.stroke();
        ctx.closePath();
    }

    render() {
        return (
            <canvas ref={this.canvas}/>
        )
    }
}

export default Map;