import React from 'react';
import PropTypes from 'prop-types';
import { Modal, FormControl, Col, Form, FormGroup, InputGroup, Glyphicon, ControlLabel, Button } from 'react-bootstrap';
import Ediphy from '../../../../../core/editor/main';
import i18n from 'i18next';
import ReactDOM from 'react-dom';
import SearchComponent from './SearchComponent';

export default class OpenClipArtComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            query: '',
            msg: i18n.t("FileModal.APIProviders.no_files"),
        };
        this.onSearch = this.onSearch.bind(this);
    }
    render() {
        return <div className="contentComponent">
            <Form horizontal action="javascript:void(0);">
                <h5>{this.props.icon ? <img className="fileMenuIcon" src={this.props.icon } alt=""/> : this.props.name}
                    <SearchComponent query={this.state.value} onChange={(e)=>{this.setState({ query: e.target.value });}} onSearch={this.onSearch} /></h5>
                <hr />

                <FormGroup>
                    <Col md={2}>
                        <Button type="submit" className="btn-primary hiddenButton" onClick={(e) => {
                            this.onSearch(this.state.query);
                            e.preventDefault();
                        }}>{i18n.t("vish_search_button")}
                        </Button>
                    </Col>
                </FormGroup>

            </Form>
            <Form className={"ExternalResults"}>
                {this.state.results.length > 0 ?
                    (
                        <FormGroup>
                            <ControlLabel>{ this.state.results.length + " " + i18n.t("FileModal.APIProviders.results")}</ControlLabel>
                            <br />
                            {this.state.results.map((item, index) => {
                                let border = item.url === this.props.elementSelected ? "solid orange 3px" : "solid transparent 3px";
                                return (
                                    <img key={index}
                                        src={item.thumbnail}
                                        className={'catalogImage'}
                                        style={{
                                            border: border,
                                        }}
                                        title={item.title}
                                        onClick={e => {
                                            this.props.onElementSelected(item.title, item.url, 'image');
                                        }}
                                    />
                                );
                            })}
                        </FormGroup>
                    ) :
                    (
                        <FormGroup>
                            <ControlLabel id="serverMsg">{this.state.msg}</ControlLabel>
                        </FormGroup>
                    )
                }
            </Form>
        </div>;
    }

    onSearch(text) {
        const BASE_OPENCLIPART = "https://openclipart.org";
        const BASE = BASE_OPENCLIPART + "/search/json/?query=" + encodeURI(text) + "&amount=200";
        this.setState({ msg: i18n.t("FileModal.APIProviders.searching") });
        fetch(encodeURI(BASE))
            .then(res => res.json()
            ).then(imgs => {
                if (imgs && imgs.payload) {
                    let results = imgs.payload.map(img=>{
                        return {
                            title: img.title,
                            url: BASE_OPENCLIPART + (img.svg.url || img.svg.png_2400px),
                            thumbnail: BASE_OPENCLIPART + (img.svg.url || img.svg.png_thumb),
                        };
                    });

                    this.setState({ results, msg: results.length > 0 ? '' : i18n.t("FileModal.APIProviders.no_files") });
                }
            }).catch(e=>{
                console.error(e);
                this.setState({ msg: i18n.t("FileModal.APIProviders.error") });
            });
    }
}

OpenClipArtComponent.propTypes = {
    /**
     * Selected Element
     */
    elementSelected: PropTypes.any,
    /**
     * Select element callback
     */
    onElementSelected: PropTypes.func.isRequired,
};