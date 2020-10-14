import React from 'react';
import { Collapse } from 'antd';
import ReactDOM from "react-dom";

const { Panel } = Collapse;

function collapse(obj, opt){
    const defaultOpt = { panels: [] };
    Object.assign(defaultOpt, opt);

    ReactDOM.render(<Collapse>{
        defaultOpt.panels.map((item, index) => {
            console.log(item.content);
            return <Panel header={item.header} key={ index } >
                <div dangerouslySetInnerHTML={ {__html: item.content } }>
                </div>
            </Panel>
        })
    }</Collapse>, obj);
}

window.QscmfAntd = window.QscmfAntd ? window.QscmfAntd : {};

window.QscmfAntd = Object.assign(window.QscmfAntd, { collapse });

