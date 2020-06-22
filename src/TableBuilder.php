<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class TableBuilder implements ConvertHtml{

    protected $columns = [];
    protected $data = [];

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

    public function __toString()
    {
        $id = Str::uuid();

        $template = <<<template
<div id="{$id}"></div>
<notdefined name="qa-builder-table">
    <script src="/Public/qa-builder/qa-builder-table.js"></script>
    <define name="qa-builder-table" value="1" />
</notdefined>
<script>
QscmfAntd.table(document.getElementById('{$id}'), {$this->genOpt()});
</script>
template;

        return (string)((new View())->fetch('', $template));
    }
}