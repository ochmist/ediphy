import React from 'react';
import Object3DComponent from '../components/Object3DComponent';

/* eslint-disable react/prop-types */
export function Objetos3D(base) {

    return {
        getRenderTemplate: function(state, props) {
            return (<Object3DComponent src={state.url} color={state.color}/>);
        },
    };
}
/* eslint-enable react/prop-types */
