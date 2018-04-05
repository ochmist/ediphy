import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import EditorBox from '../editor_box/EditorBox';
import EditorShortcuts from '../editor_shortcuts/EditorShortcuts';
import Alert from './../../common/alert/Alert';
import { Col, Button } from 'react-bootstrap';
import EditorHeader from '../editor_header/EditorHeader';
import interact from 'interactjs';
import { ADD_BOX, changeGlobalConfig, changeNavItemName } from '../../../../common/actions';
import { isSortableBox } from '../../../../common/utils';
import { aspectRatio, createBox, instanceExists } from '../../../../common/common_tools';
import Ediphy from '../../../../core/editor/main';
import ReactResizeDetector from 'react-resize-detector';
import i18n from 'i18next';
import { SnapGrid } from './SnapGrid';
import { ID_PREFIX_BOX } from '../../../../common/constants';
/**
 * EditorCanvasSli component
 * Canvas component to display slides
 */
export default class EditorCanvasSli extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: null,
        };
    }

    render() {
        let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
        let titles = [];
        if (itemSelected && itemSelected.id !== 0) {
            let initialTitle = this.props.viewToolbars[itemSelected.id].viewName;
            titles.push(initialTitle);
            if (!this.props.fromCV) {
                let parent = itemSelected.parent;
                while (parent !== 0) {
                    titles.push(this.props.viewToolbars[parent].viewName);
                    parent = this.props.navItems[parent].parent;
                }
            }
            titles.reverse();
        }

        let maincontent = document.getElementById(this.props.fromCV ? "contained_maincontent" : "maincontent");
        let actualHeight;
        if (maincontent) {
            actualHeight = parseInt(maincontent.scrollHeight, 10);
            actualHeight = (parseInt(maincontent.clientHeight, 10) < actualHeight) ? (actualHeight) + 'px' : '100%';
        }

        let overlayHeight = actualHeight ? actualHeight : '100%';
        let boxes = itemSelected ? itemSelected.boxes : [];
        let backgroundIsUri = (/data\:/).test(itemSelected.background);
        let isColor = (/rgb[a]?\(\d+\,\d+\,\d+(\,\d)?\)/).test(itemSelected.background);
        let gridOn = this.props.grid && ((this.props.containedViewSelected !== 0) === this.props.fromCV);
        return (
            <Col id={this.props.fromCV ? 'containedCanvas' : 'canvas'} md={12} xs={12} className="canvasSliClass"
                style={{ display: this.props.containedViewSelected !== 0 && !this.props.fromCV ? 'none' : 'initial' }}>
                <div id={this.props.fromCV ? 'airlayer_cv' : 'airlayer'}
                    className={'slide_air'}
                    style={{ margin: 'auto', visibility: (this.props.showCanvas ? 'visible' : 'hidden') }}>
                    <div id={this.props.fromCV ? "contained_maincontent" : "maincontent"}
                        ref="slideDropZone"
                        onMouseDown={e => {
                            if (e.target === e.currentTarget) {
                                this.props.onBoxSelected(-1);
                                this.setState({ showTitle: false });
                            }

                            e.stopPropagation();
                        }}
                        className={'innercanvas sli'}
                        style={{ visibility: (this.props.showCanvas ? 'visible' : 'hidden'), background: isColor ? itemSelected.background : '',
                            backgroundImage: (!isColor && itemSelected.background) ? 'url(' + itemSelected.background.background + ')' : '',
                            backgroundSize: (itemSelected.background && (itemSelected.background.attr === 'centered' || itemSelected.background.attr === 'repeat')) ? 'auto 100%' : 'cover',
                            backgroundRepeat: (itemSelected.background && (itemSelected.background.attr === 'centered' || itemSelected.background.attr === 'full')) ? 'no-repeat' : 'repeat',
                            backgroundPosition: (itemSelected.background && (itemSelected.background.attr === 'centered' || itemSelected.background.attr === 'full')) ? 'center center' : '0% 0%' }}>
                        {this.state.alert}
                        {gridOn ? <SnapGrid key={this.props.fromCV}/> : null}
                        <EditorHeader titles={titles}
                            onBoxSelected={this.props.onBoxSelected}
                            courseTitle={this.props.title}
                            navItem={this.props.navItemSelected}
                            navItems={this.props.navItems}
                            marks={this.props.marks}
                            pluginToolbars={this.props.pluginToolbars}
                            containedView={this.props.containedViewSelected}
                            containedViews={this.props.containedViews}
                            viewToolbars={this.props.viewToolbars}
                            boxes={this.props.boxes}
                            onTitleChanged={this.props.onTitleChanged}
                            onViewTitleChanged={this.props.onViewTitleChanged}
                        />

                        <br/>

                        <div style={{
                            width: "100%",
                            background: "black",
                            height: overlayHeight,
                            position: "absolute",
                            top: 0,
                            opacity: 0.4,
                            display: 'none', // (this.props.boxLevelSelected > 0) ? "block" : "none",
                            visibility: "collapse", // (this.props.boxLevelSelected > 0) ? "visible" : "collapse",
                        }} />

                        {boxes.map(id => {
                            let box = boxes[id];
                            return <EditorBox key={id}
                                id={id}
                                grid={gridOn}
                                page={itemSelected ? itemSelected.id : 0}
                                addMarkShortcut={this.props.addMarkShortcut}
                                boxes={this.props.boxes}
                                boxSelected={this.props.boxSelected}
                                boxLevelSelected={this.props.boxLevelSelected}
                                containedViews={this.props.containedViews}
                                containedViewSelected={this.props.containedViewSelected}
                                accordions={this.props.accordions}
                                marks={this.props.marks}
                                pluginToolbars={this.props.pluginToolbars}
                                lastActionDispatched={this.props.lastActionDispatched}
                                deleteMarkCreator={this.props.deleteMarkCreator}
                                markCreatorId={this.props.markCreatorId}
                                onBoxAdded={this.props.onBoxAdded}
                                onBoxSelected={this.props.onBoxSelected}
                                onBoxLevelIncreased={this.props.onBoxLevelIncreased}
                                onBoxMoved={this.props.onBoxMoved}
                                exercises={itemSelected ? (this.props.exercises[itemSelected.id].exercises[id]) : undefined}
                                onBoxResized={this.props.onBoxResized}
                                onRichMarkMoved={this.props.onRichMarkMoved}
                                onSortableContainerResized={this.props.onSortableContainerResized}
                                onBoxesInsideSortableReorder={this.props.onBoxesInsideSortableReorder}
                                onBoxDropped={this.props.onBoxDropped}
                                onVerticallyAlignBox={this.props.onVerticallyAlignBox}
                                onRichMarksModalToggled={this.props.onRichMarksModalToggled}
                                onTextEditorToggled={this.props.onTextEditorToggled}
                                setCorrectAnswer={this.props.setCorrectAnswer}
                                pageType={itemSelected.type || 0}
                            />;

                        })}
                    </div>
                    <ReactResizeDetector handleWidth handleHeight onResize={(e)=>{aspectRatio(this.props.canvasRatio, this.props.fromCV ? 'airlayer_cv' : 'airlayer', this.props.fromCV ? 'containedCanvas' : 'canvas', this.props.navItemSelected.customSize);
                    }} />
                </div>
                <EditorShortcuts
                    openConfigModal={this.props.openConfigModal}
                    box={this.props.boxes[this.props.boxSelected]}
                    containedViewSelected={this.props.containedViewSelected}
                    navItemSelected={this.props.navItemSelected}
                    isContained={this.props.fromCV}
                    onTextEditorToggled={this.props.onTextEditorToggled}
                    onBoxResized={this.props.onBoxResized}
                    onBoxDeleted={this.props.onBoxDeleted}
                    pointerEventsCallback={this.props.pluginToolbars[this.props.boxSelected] && this.props.pluginToolbars[this.props.boxSelected].config && this.props.pluginToolbars[this.props.boxSelected].config.name && Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name) ? Ediphy.Plugins.get(this.props.pluginToolbars[this.props.boxSelected].config.name).pointerEventsCallback : null}
                    onMarkCreatorToggled={this.props.onMarkCreatorToggled}
                    accordions={this.props.accordions}
                    pluginToolbar={this.props.pluginToolbars[this.props.boxSelected]}/>

            </Col>
        );
    }

    componentDidMount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).dropzone({
            accept: '.floatingEditorBox, .dnd',
            overlap: 'pointer',
            ondropactivate: function(event) {
                event.target.classList.add('drop-active');
            },
            ondragenter: function(event) {
                event.target.classList.add("drop-target");
            },
            ondragleave: function(event) {
                event.target.classList.remove("drop-target");
            },
            ondrop: function(event) {

                let mc = this.props.fromCV ? document.getElementById("contained_maincontent") : document.getElementById('maincontent');
                let al = this.props.fromCV ? document.getElementById('airlayer_cv') : document.getElementById('airlayer');
                let rect = event.target.getBoundingClientRect();
                let x = (event.dragEvent.clientX - rect.left - mc.offsetLeft) * 100 / mc.offsetWidth;
                let y = (event.dragEvent.clientY - rect.top + mc.scrollTop /* - parseFloat(al.style.marginTop)*/) * 100 / mc.offsetHeight;
                let config = Ediphy.Plugins.get(event.relatedTarget.getAttribute("name")).getConfig();
                let w = parseFloat(config.initialWidthSlide ? config.initialWidthSlide : (config.initialWidth ? config.initialWidth : '25%'));
                let h = parseFloat(config.initialHeightSlide ? config.initialHeightSlide : (config.initialHeight ? config.initialHeight : '30%'));
                if ((w + x) > 100) {
                    x = 100 - w;
                }
                if ((h + y) > 100) {
                    y = 100 - h;
                }
                let position = {
                    x: x + "%",
                    y: y + "%",
                    type: 'absolute',
                };
                if (event.relatedTarget.classList.contains('rib')) {
                    let name = event.relatedTarget.getAttribute("name");
                    let apiPlugin = Ediphy.Plugins.get(name);
                    if (!apiPlugin) {
                        return;
                    }
                    config = apiPlugin.getConfig();

                    if (config.limitToOneInstance) {
                        if (instanceExists(event.relatedTarget.getAttribute("name"))) {
                            let alert = (<Alert className="pageModal"
                                show
                                hasHeader
                                backdrop={false}
                                title={<span><i className="material-icons alert-warning" >
                                        warning</i>{i18n.t("messages.alert")}</span>}
                                closeButton onClose={() => {this.setState({ alert: null });}}>
                                <span> {i18n.t('messages.instance_limit')} </span>
                            </Alert>);
                            this.setState({ alert: alert });
                            return;
                        }
                    }
                    let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
                    let page = itemSelected.id;
                    let ids = {
                        parent: page,
                        container: 0,
                        position: position,
                        id: (ID_PREFIX_BOX + Date.now()),
                        page: page,
                    };
                    createBox(ids, name, true, this.props.onBoxAdded, this.props.boxes);

                } else {
                    let boxDragged = this.props.boxes[this.props.boxSelected];
                    let itemSelected = this.props.fromCV ? this.props.containedViewSelected : this.props.navItemSelected;
                    if (boxDragged.parent !== itemSelected.id) {
                        this.props.onBoxDropped(this.props.boxSelected,
                            0, 0, itemSelected.id, 0, boxDragged.parent, boxDragged.container, position);
                    }
                    let clone = document.getElementById('clone');
                    if (clone) {
                        clone.parentElement.removeChild(clone);
                    }
                }
                event.dragEvent.stopPropagation();
            }.bind(this),
            ondropdeactivate: function(event) {
                event.target.classList.remove('drop-active');
                event.target.classList.remove("drop-target");
            },
        });
        aspectRatio(this.props.canvasRatio, this.props.fromCV ? 'airlayer_cv' : 'airlayer', 'canvas', this.props.navItemSelected.customSize);
    }

    componentWillUnmount() {
        interact(ReactDOM.findDOMNode(this.refs.slideDropZone)).unset();
    }

    componentWillUpdate(nextProps) {
        if (this.props.canvasRatio !== nextProps.canvasRatio || this.props.navItemSelected !== nextProps.navItemSelected) {
            window.canvasRatio = nextProps.canvasRatio;
            aspectRatio(nextProps.canvasRatio, nextProps.fromCV ? 'airlayer_cv' : 'airlayer', 'canvas', nextProps.navItemSelected.customSize);
        }

    }
}
EditorCanvasSli.propTypes = {
    /**
     * Object containing every accordion by id
     */
    accordions: PropTypes.object.isRequired,
    /**
     * Si se renderiza el componente desde una vista contenida (true) o una normal (false)
     */
    fromCV: PropTypes.bool,
    /**
     * Relación de aspecto para diapositivas
     */
    canvasRatio: PropTypes.number.isRequired,
    /**
     * Indicador de si se muestra el canvas (tiene qu haber un navItem seleccionado)
     */
    showCanvas: PropTypes.bool,
    /**
     * Diccionario que contiene todas las cajas creadas, accesibles por su *id*
     */
    boxes: PropTypes.object.isRequired,
    /**
     * Caja seleccionada en el momento. Si no hay ninguna, -1
     */
    boxSelected: PropTypes.any.isRequired,
    /**
     * Nivel de profundidad de caja seleccionada (sólo para plugins dentro de plugins)
     */
    boxLevelSelected: PropTypes.number.isRequired,
    /**
     * Diccionario que contiene todas las vistas creadas, accesibles por su *id*
     */
    navItems: PropTypes.object.isRequired,
    /**
     * Vista  seleccionada identificada por su *id*
     */
    navItemSelected: PropTypes.any.isRequired,
    /**
     * Diccionario que contiene todas las vistas contenidas, accesibles por su *id*
     */
    containedViews: PropTypes.object.isRequired,
    /**
     * Vista contenida seleccionada identificada por su *id*
     */
    containedViewSelected: PropTypes.any.isRequired,
    /**
     * Título del curso
     */
    title: PropTypes.string.isRequired,
    /**
     * Diccionario que contiene todas las istas creadas , accesibles por su *id*
     */
    viewToolbars: PropTypes.object.isRequired,
    /**
     * Diccionario que contiene todos los valores de cajas, accesibles por su *id*
     */
    pluginToolbars: PropTypes.object.isRequired,
    /**
     * Última acción realizada en Redux
     */
    lastActionDispatched: PropTypes.any.isRequired,
    /**
     * Añade una marca a la caja
     */
    addMarkShortcut: PropTypes.func.isRequired,
    /**
     * Función que oculta el overlay de creación de marcas
     */
    deleteMarkCreator: PropTypes.func.isRequired,
    /**
     * Identificador de la caja en la que se va a crear una marca
     */
    markCreatorId: PropTypes.any.isRequired,
    /**
     * Object containing box marks
     */
    marks: PropTypes.object,
    /**
     * Oculta/muestra el overlay de creación de marcas
     */
    onMarkCreatorToggled: PropTypes.func.isRequired,
    /**
     * Añade una caja
     */
    onBoxAdded: PropTypes.func.isRequired,
    /**
     * Borra una caja
     */
    onBoxDeleted: PropTypes.func.isRequired,
    /**
     * Selecciona la caja
     */
    onBoxSelected: PropTypes.func.isRequired,
    /**
     * Aumenta el nivel de profundidad de selección (plugins dentro de plugins)
     */
    onBoxLevelIncreased: PropTypes.func.isRequired,
    /**
     * Mueve la caja
     */
    onBoxMoved: PropTypes.func.isRequired,
    /**
     * Redimensiona la caja
     */
    onBoxResized: PropTypes.func.isRequired,
    /**
     * Suelta la caja en una zona de un EditorBoxSortable
     */
    onBoxDropped: PropTypes.func.isRequired,
    /**
     * Alínea la caja verticalmente
     */
    onVerticallyAlignBox: PropTypes.func.isRequired,
    /**
     * Reordena las cajas dentro de su contenedor
     */
    onBoxesInsideSortableReorder: PropTypes.func.isRequired,
    /**
     * Redimensiona un contenedor
     */
    onSortableContainerResized: PropTypes.func.isRequired,
    /**
     * Hace aparecer/desaparecer el CKEditor
     */
    onTextEditorToggled: PropTypes.func.isRequired,
    /**
     * Whether or not the grid is activated for slides
     */
    grid: PropTypes.bool,
    /**
      * Hace aparecer/desaparecer el modal de configuración de marcas
      */
    onRichMarksModalToggled: PropTypes.func.isRequired,
    /**
     * Callback for moving marks
     */
    onRichMarkMoved: PropTypes.func.isRequired,
    /**
     * Callback for modify course title
     */
    onTitleChanged: PropTypes.func.isRequired,
    /**
     * Callback for modify navitem title and subtitle
     */
    onViewTitleChanged: PropTypes.func.isRequired,
    /**
   * Object containing all exercises
   */
    exercises: PropTypes.object,
    /**
   * Function for setting the right answer of an exercise
   */
    setCorrectAnswer: PropTypes.func.isRequired,
    /**
     * Callback for opening global configuration modal
     */
    openConfigModal: PropTypes.func,

};
