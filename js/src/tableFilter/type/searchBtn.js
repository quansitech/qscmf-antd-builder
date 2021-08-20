import { Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import React,{ useState, useEffect } from 'react';

function SearchBtn(props){
    const [loadingState, setLoadingState] = useState(props.loading);

    useEffect(()=>{
        setLoadingState(props.loading);
    }, [props.loading])

    const handleClick=(e)=>{
        if(props.onClick){
            setLoadingState(true);
            props.onClick(e);
            setLoadingState(false);
        }
    }

    return <div className={props.className}>
        <Button
            htmlType={props.htmlType}
            style={{color:'gray'}}
            loading={loadingState}
            icon={<SearchOutlined />}
            onClick={ handleClick }
        />
    </div>
}

export default SearchBtn;