import React from 'react';
import ReactDOM from "react-dom";
import { DatePicker } from 'antd';
import moment from "moment";
import locale from 'antd/es/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn';

const { RangePicker } = DatePicker;

function datepicker(obj, opt){
    const defaultOpt = { type: 'DatePicker', onChange: () => {}, picker: "date", defaultValue: []};

    if(opt.defaultValue && opt.defaultValue.length > 0){
        opt.defaultValue = opt.defaultValue.map(item => moment(item));
        if(opt.defaultValue.length === 1){
            opt.defaultValue = opt.defaultValue[0];
        }
    }

    Object.assign(defaultOpt, opt);

    if (defaultOpt.type === 'DatePicker'){
        ReactDOM.render(<DatePicker onChange={defaultOpt.onChange} picker={defaultOpt.picker} locale={locale} defaultValue={defaultOpt.defaultValue} />, obj);
    }else{
        ReactDOM.render(<RangePicker onChange={defaultOpt.onChange} picker={defaultOpt.picker} locale={locale} defaultValue={defaultOpt.defaultValue} />, obj);
    }
}

window.QscmfAntd = window.QscmfAntd ? window.QscmfAntd : {};

window.QscmfAntd = Object.assign(window.QscmfAntd, { datepicker });