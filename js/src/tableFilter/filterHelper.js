import moment from "moment";
import PickerHelper from "./pickerHelper";
import DefFilterParam from "./defFilterParam";

const FilterHelper = {
    transcodeSearchMomentToStr:(searchParam, filterOpt)=>{
        const momentFilterOpt = FilterHelper.getMomentTypeOpt(filterOpt);
        if (momentFilterOpt){
            Object.entries(searchParam).forEach(searchItem => {
                const key = searchItem[0];
                const value = searchItem[1];
                let val_str = searchItem[1];

                if (value && Array.isArray(value)){
                    val_str = FilterHelper.transcodeRangeMoment(value, momentFilterOpt[key]);
                }

                if (value && moment.isMoment(value)){
                    val_str = FilterHelper.transcodeSinglePickerMoment(value, momentFilterOpt[key]);
                }
                val_str ? searchParam[key] = val_str : null;
            });
        }

        return searchParam;
    },
    getMomentTypeOpt:(filterOpt)=>{
        let momentFilterOpt = {};

        filterOpt.forEach(val => {
            if(DefFilterParam.momentItemType.includes(val.type)){
                momentFilterOpt[val.key] = val;
            }
        });

        return momentFilterOpt;
    },
    transcodeRangeMoment:(value, momentFilterOpt)=>{
        let val_arr = [];
        value.forEach(itemValue => {
            moment.isMoment(itemValue) ? val_arr.push(itemValue) : null;
        })
        if (val_arr.length>0){
            const range_format = PickerHelper.genRangeFormat(momentFilterOpt.options.format,momentFilterOpt.options.picker,momentFilterOpt.options.showTime);
            const separator = momentFilterOpt.options.valueSeparator ? momentFilterOpt.options.valueSeparator : DefFilterParam.rangeDefSpe;
            return  PickerHelper.joinValueWithSep(PickerHelper.momentArrToStrArr(val_arr, range_format), separator);
        }
    },
    transcodeSinglePickerMoment:(value, momentFilterOpt)=>{
        const date_format = PickerHelper.initPickerFormat(momentFilterOpt.options.format,momentFilterOpt.options.picker,momentFilterOpt.options.showTime);
        return  PickerHelper.momentToStr(value, date_format);
    },
};

export default FilterHelper;