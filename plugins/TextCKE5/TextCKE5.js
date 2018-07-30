import React from 'react';
import i18n from 'i18next';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
/* eslint-disable react/prop-types */
export function TextCKE5(base) {
    return {
        getConfig: function() {
            return {
                name: 'TextCKE5',
                displayName: i18n.t('TextCKE5.PluginName'),
                category: "text",
                needsConfigModal: false,
                needsTextEdition: true,
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'label',
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'Config',
                            icon: 'link',
                            buttons: {
                                name: {
                                    __name: 'Config',
                                    type: 'text',
                                    value: state.name,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
    };
}
/* eslint-enable react/prop-types */
