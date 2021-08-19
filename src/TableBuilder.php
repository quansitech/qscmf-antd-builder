<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class TableBuilder implements ConvertHtml{

    const FILTER_TYPE_INPUT = 'input';
    const FILTER_TYPE_SELECT = 'select';
    const FILTER_TYPE_MULTI_SELECT = 'multi_select';
    const FILTER_TYPE_DATE = 'date';
    const FILTER_TYPE_DATE_RANGE = 'date_range';

    const filter_type_list = [
        self::FILTER_TYPE_INPUT,
        self::FILTER_TYPE_SELECT,
        self::FILTER_TYPE_MULTI_SELECT,
        self::FILTER_TYPE_DATE,
        self::FILTER_TYPE_DATE_RANGE
    ];

    const FILTER_RULE_WILDCARD = 'wildcard';
    const FILTER_RULE_EXACT = 'exact';
    const FILTER_RULE_IN = 'in';
    const FILTER_RULE_LT = 'lt';
    const FILTER_RULE_ELT = 'elt';
    const FILTER_RULE_GT = 'gt';
    const FILTER_RULE_EGT = 'egt';
    const FILTER_RULE_BETWEEN = 'between';
    const FILTER_RULE_CALLBACK = 'callback';

    const filter_rule_list = [
        self::FILTER_RULE_WILDCARD,
        self::FILTER_RULE_EXACT,
        self::FILTER_RULE_IN,
        self::FILTER_RULE_LT,
        self::FILTER_RULE_ELT,
        self::FILTER_RULE_GT,
        self::FILTER_RULE_EGT,
        self::FILTER_RULE_BETWEEN,
        self::FILTER_RULE_CALLBACK,
    ];

    protected $columns = [];
    protected $data = [];
    protected $filter = [];
    protected $sorter = [];
    protected $html = '';

    public function addColumn($column){
        array_push($this->columns, $column);
        return $this;
    }

    public function addRow($row){
        array_push($this->data, $row);
        return $this;
    }

    protected function genOpt(){
        $opt = [
            'columns' => $this->columns,
            'data' => $this->data
        ];
        return json_encode($opt, JSON_PRETTY_PRINT);
    }

    public function addFuzzyFilter($name, $text, $key = '', $showLabel = false){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text' => $text,
            'type' => self::FILTER_TYPE_INPUT,
            'rule' => self::FILTER_RULE_WILDCARD,
            'changeThenSearch' => false,
            'showLabel' => $showLabel
        ]);
    }

    public function addExactFilter($name, $text, $key = '', $showLabel = false){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text'=>$text,
            'type' => self::FILTER_TYPE_INPUT,
            'rule' => self::FILTER_RULE_EXACT,
            "changeThenSearch" => false,
            'showLabel' => $showLabel
        ]);
    }

    public function addSelectFilter($name, $text, $options, $key = '', $showLabel = false, $showSearch = false, $width = null){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text' => $text,
            'type' => self::FILTER_TYPE_SELECT,
            'rule' => self::FILTER_RULE_EXACT,
            'options' => ['options' => $options, 'showSearch' => $showSearch, "width" => $width],
            'showLabel' => $showLabel
        ]);
    }

    public function addMultiSelectFilter($name, $text, $options, $key = '', $showLabel = false, $showSearch = false, $width = null){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text'=>$text,
            'type' => self::FILTER_TYPE_MULTI_SELECT,
            'rule' => self::FILTER_RULE_IN,
            'options' => ['options' => $options, 'showSearch' => $showSearch, "width" => $width],
            'showLabel' => $showLabel
        ]);
    }

    public function addDateFilter($name, $text, $rule, $picker = 'date',$format = '', $key = '', $showLabel = false){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text' => $text,
            'type' => self::FILTER_TYPE_DATE,
            'rule' => $rule,
            'changeThenSearch' => false,
            'options' =>
                ['format' => $format,'picker' => $picker],
            'showLabel' => $showLabel
        ]);
    }

    public function addDateRangeFilter($name, $text, $rule, $picker = 'date',$format = '', $key = '', $showLabel = false){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text' => $text,
            'type' => self::FILTER_TYPE_DATE_RANGE,
            'rule' => $rule,
            'options' =>
                ['format' => $format,'picker' => $picker],
            'showLabel' => $showLabel
        ]);
    }

    public function addSelfFilter($name, $text, $type, $callback, $key = '', $showLabel = false){
        return $this->addFilter([
            'key' => $key,
            'name' => $name,
            'text' => $text,
            'type' => $type,
            'rule' => 'callback',
            'options' => ['callback' => $callback],
            'showLabel' => $showLabel
        ]);
    }

    public function addFilter($filter){
        $filter['key'] = $filter['key']?:$filter['name'];
        $filter['changeThenSearch'] = $filter['changeThenSearch'] === false ?:'1';
        $filter['showLabel'] = $filter['showLabel'] === false ?:'1';

        if (!$this->validateFilter($filter['type'], $filter['rule'])){
            E('设置错误type 或者 rule 错误');
        }
        array_push($this->filter, $filter);
        return $this;
    }

    public function addDefSorter($name){
        return $this->addSorter(['name' => $name]);
    }

    public function addSelfSorter($name, $callback){
        return $this->addSorter([
            'name' => $name,
            'type' => 'callback',
            'options'=>['callback' => $callback]
        ]);
    }

    public function addCustomSorter($name, $options){
        return $this->addSorter([
            'name' => $name,
            'type' => 'custom',
            'options' => ['options' => $options]
        ]);
    }

    public function addSorter($sorter){
        array_push($this->sorter, $sorter);
        return $this;
    }

    protected function jsonEncode($array){
        return json_encode($array, JSON_PRETTY_PRINT);
    }

    protected function validateDateRule($rule){
        return in_array(strtolower($rule), [self::FILTER_RULE_LT, self::FILTER_RULE_ELT, self::FILTER_RULE_GT, self::FILTER_RULE_EGT, self::FILTER_RULE_BETWEEN]);
    }

    protected function validateFilter($type, $rule){
        if (!in_array($type, self::filter_type_list) || !in_array($rule, self::filter_rule_list)){
            return false;
        }

        if (in_array($type, [self::FILTER_TYPE_DATE, self::FILTER_TYPE_DATE_RANGE])){
            return $this->validateDateRule($rule);
        }

        return true;
    }

    public function __toString()
    {
        if(!$this->html){
            $id = Str::uuid();

            $template = <<<template
<div id="{$id}"></div>
<notdefined name="qa-builder-table">
    <script src="{:asset('qa-builder/qa-builder-table.js')}"></script>
    <define name="qa-builder-table" value="1" />
</notdefined>
<script>
QscmfAntd.table(document.getElementById('{$id}'), {$this->genOpt()}, '{$id}', {$this->jsonEncode($this->filter)}, {$this->jsonEncode($this->sorter)});
</script>
template;
            $this->html = (string)((new View())->fetch('', $template));
        }


        return $this->html;
    }
}