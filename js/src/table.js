import React from 'react';
import { Table } from 'antd';
import ReactDOM from "react-dom";

function table(obj, opt){
    const defaultOpt = { columns: [], data: []};
    Object.assign(defaultOpt, opt);

    const pagination = {
        total: defaultOpt.data.length,
        hideOnSinglePage: true,
        pageSize: 10
    };
    ReactDOM.render(<Table columns={defaultOpt.columns} dataSource={defaultOpt.data} size="small" pagination={pagination}  />, obj);
}

window.QscmfAntd = window.QscmfAntd ? window.QscmfAntd : {};

window.QscmfAntd = Object.assign(window.QscmfAntd, { table });

