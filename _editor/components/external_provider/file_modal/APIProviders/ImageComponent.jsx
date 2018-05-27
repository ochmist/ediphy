import React from 'react';
import PropTypes from 'prop-types';

export default class ImageComponent extends React.Component {
    render() {
        let { url, title, thumbnail } = this.props;
        return url ? <img onError={(e)=>{
            e.target.style.display = 'none';
        }} src={thumbnail || url}
        className={'catalogImage ' + (this.props.isSelected ? 'catalogImageSelected' : '')}
        title={title}
        onClick={e => {
            this.props.onElementSelected(title, url, 'image');
        }}
        /> : null;
    }
}
