import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import ReactDOM from "react-dom";
import DefFilterParam from "./tableFilter/defFilterParam";
import Filter from "./tableFilter/filter";

function table(obj, opt, id=null, filter=null, sorter=null, apiUrl = null, pagination = null){
    const defaultOpt = { columns: [], data: []};
    const shareOnCell = (dataIndex)=>{
        return (record,index)=>{
            let cellObj = {};
            if (record.hasOwnProperty("cellProperties") && record.cellProperties.hasOwnProperty(dataIndex)){
                cellObj = record.cellProperties[dataIndex];
            }

            return cellObj;
        }
    }
    Object.assign(defaultOpt, opt);
    for (let  key in defaultOpt.columns){
        defaultOpt.columns[key].onCell = shareOnCell(defaultOpt.columns[key].dataIndex);
    }

    if (apiUrl){
        ReactDOM.render(<QsTableUseApi opt={opt} id = {id} filter = {filter} sorter = {sorter} apiUrl = {apiUrl} />, obj);
    }else{
        ReactDOM.render(<QsTable opt={opt} id = {id} filter = {filter} sorter = {sorter} cusPagination = {pagination} />, obj);
    }
}

function QsTable({opt, id=null, filter=null, sorter=null, cusPagination=null}){
    const [tableOpt, setTableOpt] = useState(opt);

    useEffect(()=>{
        if (Array.isArray(sorter)){
            const new_columns = tableOpt.columns.map((item) =>{
                sorter.forEach(sorter_item => {
                    if(sorter_item.name === item.dataIndex){
                        switch (sorter_item.type){
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

    const pagination = handlePaginate( cusPagination,{
        total: tableOpt.data.length,
        hideOnSinglePage: true,
        defaultPageSize: 10,
        showQuickJumper: true
    });

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
            { (filter && filter.length > 0) && <Filter filter={filter} id={id} onFinished = { handleFilterData } />}
            <Table columns={tableOpt.columns} dataSource={ tableOpt.data } size="small" pagination={pagination} />
        </>
}

const handlePaginate = (cusPagination, defPaginate) => {
    if(cusPagination === 'none'){
        return false;
    }
    return defPaginate;
}

const objToQs = (obj)=>{
    let query_arr = [];
    Object.entries(obj).filter(item => !(item[1] === undefined || item[1] === null || item[1] === '')).forEach(item=>{
        query_arr.push(item.join('='));
    })

    return query_arr.length > 0 ? query_arr.join("&") : "";
};

function QsTableUseApi({opt, id=null, filter=null, sorter=null, apiUrl = null}){
    const [tableOpt, setTableOpt] = useState(opt);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        total: tableOpt.data?.length||0,
        defaultPageSize: 10,
        showQuickJumper: true,
        current: 1,
        pageSize: 10,
    });

    const [query, setQuery] = useState({pagination});

    useEffect(()=>{
        if (Array.isArray(sorter)){
            const new_columns = tableOpt.columns.map((item) =>{
                sorter.forEach(sorter_item => {
                    if(sorter_item.name === item.dataIndex){
                        item.sorter = true;
                    }
                });
                return item;
            });

            let newTableOpt = tableOpt;
            newTableOpt.columns = new_columns;
            setTableOpt(newTableOpt);
        }
    }, []);

    useEffect(()=>{
        fetchData(query);
    }, [query]);

    const handleFilterData = (searchParam)=>{
        let searchData = {};
        Object.entries(searchParam).forEach((arr)=>{
            searchData[arr[0]] = Array.isArray(arr[1]) ? arr[1].join(',') : arr[1];
        });

        let newPagination = pagination;
        newPagination.current = 1;
        setPagination({...newPagination});
        searchData.pagination = newPagination;

        let newQuery = Object.assign(query, searchData);
        mergeAndFilterQuery(newQuery);
    };

    const getRandomUserParams = (params) => ({
        page: params.pagination?.current,
        per_page: params.pagination?.pageSize,
        ...params,
    });

    const fetchData = (params = {}) => {
        setLoading(true);
        fetch(apiUrl+`?${objToQs(getRandomUserParams(params))}`)
            .then((res) => res.json())
            .then((results) => {
                let newTableOpt = {};
                Object.assign(newTableOpt, opt);
                newTableOpt.data = results.data?.list||[];
                setTableOpt({...newTableOpt});

                let newPagination = params.pagination;
                newPagination.total = results.data?.count;
                setPagination({...newPagination});

                setLoading(false);

            });
    };

    const mergeAndFilterQuery = (params) => {
        Object.entries(params).forEach((oneQueryArr)=>{
            const key = oneQueryArr[0];
            const val = oneQueryArr[1];
            if (val){
                query[key]=val;
            }else if(query.hasOwnProperty(key)){
                delete query.key;
            }
        });
        setQuery({...query});
    }

    const handleTableChange = (newPagination, filters, sorter) => {
        let params = {
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination:newPagination,
            ...filters,
        };
        let newQuery = Object.assign(query, params);
        mergeAndFilterQuery(newQuery);
    };

    return <>
        { (filter && filter.length > 0) && <Filter filter={filter} id={id} onFinished = { handleFilterData } />}
        <Table columns={tableOpt.columns} dataSource={ tableOpt.data } size="small" pagination={pagination}
               loading={loading}
               onChange={handleTableChange}
        />
    </>
}

window.QscmfAntd = window.QscmfAntd ? window.QscmfAntd : {};

window.QscmfAntd = Object.assign(window.QscmfAntd, { table });

