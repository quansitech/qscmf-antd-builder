<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class DatepickerBuilder implements ConvertHtml{

    const TYPE_DATEPICKER = 'DatePicker';
    const TYPE_RANGEPICKER = 'RangePicker';

    const PICKER_DATE = 'date';
    const PICKER_WEEK = 'week';
    const PICKER_MONTH = 'month';
    const PICKER_YEAR = 'year';
    const PICKER_QUARTER = 'quarter';

    protected $type = '';
    protected $picker = '';
    protected $html = '';
    protected $defaultValue = [];

    public function parseParam(array $get_data) : array{
        if($this->type === self::TYPE_DATEPICKER){
            return $get_data[$this->getParamKey()] ? [$get_data[$this->getParamKey()]] : [];
        }
        else{
            $date_range = $get_data[$this->getParamKey()] ? explode("_", $get_data[$this->getParamKey()]) : [];
            return $date_range;
        }
    }

    public function __construct(string $type = self::TYPE_DATEPICKER, string $picker = self::PICKER_DATE)
    {
        if ($type){
            $this->setType($type);
        }

        if($picker){
            $this->setPicker($picker);
        }
    }

    //时间字符串 2022-02-01 01:59:59
    public function setDefaultValue(array $dates){
        $this->defaultValue = $dates;
        return $this;

    }

    public function setType(string $type){
        $this->type = $type;
        return $this;
    }

    public function setPicker(string $picker){
        $this->picker = $picker;
        return $this;
    }

    protected function genOpt(){
        $opt = [
            'type' => $this->type,
            'picker' => $this->picker,
            'defaultValue' => $this->defaultValue
        ];
        return json_encode($opt, JSON_PRETTY_PRINT);
    }

    protected function getParamKey(){
        return $this->type === self::TYPE_DATEPICKER ? 'date' : 'date_range';
    }

    protected function genParseKeyPair(){
        if($this->type === self::TYPE_DATEPICKER){
            $fn = <<<javscript
    function parseKeyPair(dateString){
        return '{$this->getParamKey()}=' + dateString;
    }
javscript;

        }
        else{
            $fn = <<<javscript
    function parseKeyPair(dateString){
        return '{$this->getParamKey()}=' + dateString.join('_');
    }
javscript;
        }

        return $fn;

    }

    public function __toString(){
        if(!$this->html){
            $id = Str::uuid();

            $template = <<<template
<div id="{$id}"></div>
<notdefined name="qa-builder-datepicker">
    <script src="{:asset('qa-builder/qa-builder-datepicker.js')}"></script>
    <define name="qa-builder-datepicker" value="1" />
</notdefined>
<script>
    {$this->genParseKeyPair()}

    var opt = {$this->genOpt()};
    
    Object.assign(opt, {onChange: function(date, dateString){
        var url = window.location.href;
        if(url.indexOf('?') > -1){
            url = url + '&' + parseKeyPair(dateString);
        }
        else{
            url = url + '?' + parseKeyPair(dateString);
        }
        window.location.href = url;
    }});
QscmfAntd.datepicker(document.getElementById('{$id}'), opt);
</script>
template;
            $this->html = (string)((new View())->fetch('', $template));
        }

        return $this->html;
    }
}