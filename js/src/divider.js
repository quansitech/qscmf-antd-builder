import React from 'react';
import { Divider } from 'antd';
import ReactDOM from "react-dom";

function divider(obj, opt){
    const defaultOpt = {
        orientation:'center'
    };
    Object.assign(defaultOpt, opt);
    ReactDOM.render(<Divider  orientation={defaultOpt.orientation}>{ obj.innerText }</Divider>, obj);
}

window.QscmfAntd = window.QscmfAntd ? window.QscmfAntd : {};

window.QscmfAntd = Object.assign(window.QscmfAntd, { divider});

