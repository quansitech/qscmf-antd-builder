import React from 'react';
import { Form,Input,Select,DatePicker,message,Row,Col } from 'antd';

import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import SearchBtn  from './type/searchBtn';
import PickerHelper from "./pickerHelper";
import FilterHelper from "./filterHelper";

const { RangePicker } = DatePicker;

function Filter({id, onFinished, loading = false, filter = null}){
    const [form] = Form.useForm();

    const buildSearchItem = (option)=>{
        let item='';
        switch(option.type){
            case 'input':
                item =<Input
                    placeholder={option.text}
                    allowClear
                />
                break;
            case 'multi_select':
                item=<Select
                        mode="multiple"
                        options={ option.options.options }
                        placeholder={option.text}
                        style={{ width: option.options.width ? option.options.width : "100px"}}
                        optionFilterProp="label"
                    />
                break;
            case 'select':
                item=<Select
                    options={ option.options.options }
                    placeholder={option.text }
                    allowClear
                    showSearch={option.options.showSearch === '1'}
                    optionFilterProp="label"
                    style={{ width: option.options.width ? option.options.width : "100px"}}
                />
                break;
            case 'date_range':
                const range_format = PickerHelper.genRangeFormat(option.options.format,option.options.picker,option.options.showTime);
                item=<RangePicker
                    picker={option.options.picker}
                    format={range_format}
                    locale={locale}
                    inputReadOnly={true}
                    allowEmpty={ [true, true] }
                    showTime={option.options.showTime === "1"}
                />
                break;
            case 'date':
                const date_format = PickerHelper.initPickerFormat(option.options.format,option.options.picker,option.options.showTime);
                item=<DatePicker
                    picker={option.options.picker}
                    format={date_format}
                    locale={locale}
                    inputReadOnly={true}
                />
                break;
            default:
                message.error('暂不支持此类型');
                break;
        }
        return item;
    }

    const buildSearchForm = () => {
        var search_item_arr = [];

        if (Array.isArray(filter)){
            filter.forEach((option)=>{
                search_item_arr.push(
                    <Form.Item
                        key={option.key}
                        name={option.key}
                        label={option.showLabel==='1' ? <span style={{marginBottom:"0px",fontWeight:"normal"}}>{option.text+"："}</span> : null}
                        rules={option.rules}
                        style={{ marginBottom:"0.5rem" }}
                    >
                        {buildSearchItem(option)}
                    </Form.Item>
                )
            });
        }

        return search_item_arr;
    }

    const handleClickSearch = (searchParams)=>{
        searchParams = FilterHelper.transcodeSearchMomentToStr(searchParams, filter);
        onFinished && onFinished(searchParams);
    }

    const handleValueChange = (changedValues, allValues)=>{
        filter.forEach(item =>{
           if (item.changeThenSearch === '1' && Object.keys(changedValues)[0] === item.key){
               form.submit();
           }
        });
    }

    return <>
        <Form
            form={form}
            name={id+"_table_search"}
            onFinish={ handleClickSearch }
            onValuesChange = { handleValueChange }
            layout={'Inline'}
            style={{marginBottom:"0.5rem"}}
            colon={false}
        >
            <div style={{display:"inline-flex", flexWrap:"wrap", gap:"0.5rem"}}>
                {buildSearchForm()}
                <SearchBtn
                    htmlType={'submit'}
                />
            </div>
        </Form>
    </>;
}

export default Filter;