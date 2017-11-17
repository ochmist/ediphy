import React from "react";
import { Form, Button, FormGroup, FormControl, ControlLabel, Col, Grid, Row, Table, Checkbox, Radio } from "react-bootstrap";
import STLViewer from 'stl-viewer';

// let Chart = require("./chart-component");
// let Config = require("./config-component");
require('./_3dobj.scss');

export function Objects3D(base) {
    return {
        getConfig: function() {
            return {
                name: "Objects3D",
                flavor: "react",
                displayName: Dali.i18n.t("Objects3D.PluginName"),
                category: "image",
                needsConfigModal: false,
                needsTextEdition: false,
                icon: "3d_rotation",
                initialWidth: 'auto',
                initialHeight: "auto",
            };
        },
        getToolbar: function() {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        style: {
                            __name: Dali.i18n.t("Objects3D.style"),
                            icon: "palette",
                            order: [
                                "model",
                                "margins",
                                "paddings",
                                "borderWidth",
                                "borderStyle",
                                "borderColor",
                                "borderRadius",
                                "opacity",
                            ],
                            accordions: {
                                model: {
                                    __name: Dali.i18n.t("Objects3D.model"),
                                    buttons: {
                                        modelColor: {
                                            __name: Dali.i18n.t("Objects3D.modelColor"),
                                            type: "color",
                                            value: base.getState().modelColor,
                                            autoManaged: false,
                                        },
                                        bckgColor: {
                                            __name: Dali.i18n.t("Objects3D.bckgColor"),
                                            type: "color",
                                            value: base.getState().bckgColor,
                                    		autoManaged: false,
                                        },
                                    },
                                },
                                margins: {
                                    __name: Dali.i18n.t("Objects3D.margin"),
                                    buttons: {
                                        left: {
                                            __name: Dali.i18n.t("Objects3D.left"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        right: {
                                            __name: Dali.i18n.t("Objects3D.right"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        top: {
                                            __name: Dali.i18n.t("Objects3D.top"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        bottom: {
                                            __name: Dali.i18n.t("Objects3D.bottom"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                    },
                                },
                                paddings: {
                                    __name: Dali.i18n.t("Objects3D.padding"),
                                    buttons: {
                                        left: {
                                            __name: Dali.i18n.t("Objects3D.left"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        right: {
                                            __name: Dali.i18n.t("Objects3D.right"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        top: {
                                            __name: Dali.i18n.t("Objects3D.top"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                        bottom: {
                                            __name: Dali.i18n.t("Objects3D.bottom"),
                                            type: "number",
                                            value: "0px",
                                            min: 0,
                                            max: 500,
                                            units: "px",
                                        },
                                    },
                                },
                            },
                            buttons: {
                                borderWidth: {
                                    __name: Dali.i18n.t("Objects3D.border_width"),
                                    type: "number",
                                    value: "0px",
                                    min: 0,
                                    max: 10,
                                    units: "px",
                                },
                                borderStyle: {
                                    __name: Dali.i18n.t("Objects3D.border_style"),
                                    type: "select",
                                    value: "solid",
                                    options: ["none", "hidden", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "initial", "inherit"],
                                },
                                borderColor: {
                                    __name: Dali.i18n.t("Objects3D.border_color"),
                                    type: "color",
                                    value: "#000000",
                                },
                                borderRadius: {
                                    __name: Dali.i18n.t("Objects3D.border_radius"),
                                    type: "number",
                                    value: "0%",
                                    min: "0",
                                    max: "50",
                                    step: "5",
                                    units: "%",
                                },
                                opacity: {
                                    __name: Dali.i18n.t("Objects3D.opacity"),
                                    type: "range",
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                url: '/human.stl',
                modelColor: '#B92C2C',
                bckgColor: '#ffffff',
            };
        },
        getRenderTemplate: function(state) {

            return (
            /* jshint ignore:start */
                <STLViewer
                    url={state.url}
                    width={400}
                    height={400}
                    modelColor={state.modelColor}
                    backgroundColor={state.bckgColor}
                    rotate
                    orbitControls
                />
            /* jshint ignore:end */
            );

        },
        getConfigTemplate: function(extState) {
            return (
            /* jshint ignore:start */
                <Config state={extState} base={base} />
            /* jshint ignore:end */
            );
        },
        fileChanged: function(event) {

            let files = event.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = function() {
                base.setState("chartData", JSON.parse(this.result));
            };
            reader.readAsText(file);
        },

        handleToolbar: function(name, value) {
            base.setState(name, value);
        },

    };
}
