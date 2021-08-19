import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import ReactDOM from "react-dom";
import DefFilterParam from "./tableFilter/defFilterParam";
import Filter from "./tableFilter/filter";

function table(obj, opt, id=null, filter=null, sorter=null){
    const defaultOpt = { columns: [], data: []};
    Object.assign(defaultOpt, opt);

    ReactDOM.render(<QsTable opt={opt} id = {id} filter = {filter} sorter = {sorter} />, obj);
}

function QsTable({opt, id=null, filter=null, sorter=null}){
    const [tableOpt, setTableOpt] = useState(opt);

    useEffect(()=>{
        if (Array.isArray(sorter)){
            const new_columns = tableOpt.columns.map((item) =>{
                sorter.forEach(sorter_item => {
                    if(sorter_item.name === item.dataIndex){
                        switch (sorter_item.type){
                            case 'custom':
                                item.sorter =  (a,b)=>{
                                    let rowA = sorter_item.options.options.indexOf(a[sorter_item.name]);
                                    let rowB = sorter_item.options.options.indexOf(b[sorter_item.name]);
                                    return rowA - rowB;
                                };
                                break;
                            case 'callback':
                                const selfFun = new Function('rowA', 'rowB', sorter_item.options.callback)
                                item.sorter = selfFun;
                                break;
                            default:
                                item.sorter = (a, b) => a[sorter_item.name] - b[sorter_item.name];
                                break;
                        }
                    }
                });
                return item;
            });

            let newTableOpt = tableOpt;
            newTableOpt.columns = new_columns;
            setTableOpt(newTableOpt);
        }
    }, []);

    const pagination = {
        total: tableOpt.data.length,
        hideOnSinglePage: true,
        defaultPageSize: 10,
        showQuickJumper: true
    };

    const handleChange = (pagination, filters, sorter)=>{
        console.log(pagination, filters, sorter);
    }

    const filterPerRecord = (value, record, filterOpt, searchData)=>{
        let flag = true ;
        switch (filterOpt.rule){
            case 'wildcard':
                searchData !=="" ? flag = value.indexOf(searchData) !== -1 : null;
                break;
            case 'exact':
                searchData !=="" ? flag = value === searchData : null;
                break;
            case 'in':
                Array.isArray(searchData) && searchData.length > 0 ? flag = searchData.includes(value) : null;
                break;
            case 'lt':
                searchData !==""  ? flag = value < searchData : null;
                break;
            case 'elt':
                searchData !==""  ? flag = value <= searchData : null;
                break;
            case 'gt':
                searchData !==""  ? flag = value > searchData : null;
                break;
            case 'egt':
                searchData !==""  ? flag = value >= searchData : null;
                break;
            case 'between':
                const separator = filterOpt.options.valueSeparator ? filterOpt.options.valueSeparator : DefFilterParam.rangeDefSpe;
                if (searchData !== "" && searchData.includes(separator)){
                    const [min, max] = searchData.split(separator);
                    if (min && max){
                        flag = min <= value && value <= max;
                    }else{
                        flag = min <= value || value <= max;
                    }
                }
                break;
            case 'callback':
                if (searchData !== ""){
                    const selfFun = new Function('value', 'record', 'searchData', filterOpt.options.callback);
                    flag = selfFun(value, record, searchData);
                }
                break;
        }

        return flag;
    }

    const handleFilterData = (searchParam)=>{
        let newTableOpt = {};
        Object.assign(newTableOpt, opt);

        let searchData = {};
        Object.entries(searchParam).filter(item => !(item[1] === undefined || item[1] === null || item[1] === '')).forEach((arr)=>{
            searchData[arr[0]] = arr[1];
        });
        if (searchData){
            let needFilterOpt = filter.filter((filterItem) => Object.keys(searchData).includes(filterItem.key))
                .map((needFilterItem) => {
                    needFilterItem.searchValue = searchData[needFilterItem.key];
                    return needFilterItem;
                });

            newTableOpt.data = newTableOpt.data.filter(record => {
                let flag = true;
                for (let i = 0; i < needFilterOpt.length; i++){
                    let filterItem = needFilterOpt[i];
                    flag = filterPerRecord(record[filterItem.name], record, filterItem, filterItem.searchValue);
                    if(flag === false){
                        break;
                    }
                }
                return flag;
            });
        }

        setTableOpt({...newTableOpt});
    };

    return <>
            { filter && <Filter filter={filter} id={id} onFinished = { handleFilterData } />}
            <Table columns={tableOpt.columns} dataSource={ tableOpt.data } size="small" pagination={pagination}  onChange={handleChange} />
        </>
}

window.QscmfAntd = window.QscmfAntd ? window.QscmfAntd : {};

window.QscmfAntd = Object.assign(window.QscmfAntd, { table });

