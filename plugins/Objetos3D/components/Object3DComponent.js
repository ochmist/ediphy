import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import { findParentBySelector } from '../../../common/utils';
import { OBJViewer, STLViewer } from 'react-stl-obj-viewer';
import ReactResizeDetector from 'react-resize-detector';

export default class Object3DComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 100,
            height: 100,
        };
        // this.onMapCreated = this.onMapCreated.bind(this);
    }

    render() {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <ReactResizeDetector handleWidth handleHeight onResize={(width, height)=>{ this.onResize(width, height);}} />

                <STLViewer
                    onSceneRendered={(element) => { }}
                    sceneClassName="test-scene"
                    url={this.props.src}
                    width={this.state.width}
                    height={this.state.height}
                    className="obj"
                    modelColor={this.props.color}/>
            </div>
        );

    }
    onResize(width, height) {
        this.setState({ width, height });
    }
    componentDidMount() {

    }

}

