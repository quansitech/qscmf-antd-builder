import moment from 'moment';
import 'moment/locale/zh-cn';

const PickerHelper = {
    genRangeFormat:(format = null, picker = "date", show_time = false) => {
        format  = PickerHelper.initPickerFormat(format,picker,show_time);
        if (format && format.length !== 2) {
            format = [format, format]
        }

        return format;
    },

    momentArrToStrArr:(defaultValue, format) => {
        return defaultValue.length > 0 ? [defaultValue[0] ? defaultValue[0].format(format[0]) : '',defaultValue[1] ?  defaultValue[1].format(format[1]) : ""] : null;
    },
    joinValueWithSep:(value, valueSeparator) =>{
        return value.join(valueSeparator);
    },
    momentToStr:(moment_val, format) => {
        return moment.isMoment(moment_val) ? moment_val.format(format) : null;
    },
    strToMoment:(str, format)=>{
        return  moment(str, format);
    },
    initPickerFormat:(format = null, picker = "date", show_time = false) => {
        if (!format) {
            switch (picker) {
                default:
                    format = show_time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
                    break;
                case "week":
                    format = 'YYYY-wo';
                    break;
                case "month":
                    format = 'YYYY-MM';
                    break;
                case "quarter":
                    format = 'YYYY-\\QQ';
                    break;
                case "year":
                    format = 'YYYY';
                    break;
            }
        }

        return format;
    }
}
export default PickerHelper;