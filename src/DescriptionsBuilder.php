<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class DescriptionsBuilder implements ConvertHtml{

    protected $items = [];
    protected $title = '';
    protected $bordered = false;

    public function __construct($title = '', $bordered = false)
    {
        $this->setTitle($title);
        $this->setBordered($bordered);
    }

    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    public function setBordered($bordered){
        $this->bordered = $bordered;
        return $this;
    }

    public function addItem($label, $content, $option = [ 'type' => '', 'span' => 0] ){
        $temp = [
            'label' => $label,
            'content' => $content
        ];

        $option['type'] && $temp['type'] = $option['type'];
        $option['span'] && $temp['span'] = $option['span'];

        array_push($this->items, $temp);
        return $this;
    }

    protected function genOpt(){
        $opt = [
            'title' => $this->title,
            'bordered' => $this->bordered,
            'column' => $this->column,
            'items' => $this->items
        ];
        return json_encode($opt, JSON_PRETTY_PRINT);
    }

    public function __toString(){
        if(!$this->html){
            $id = Str::uuid();

            $template = <<<template
<div id="{$id}">
</div>
<notdefined name="qa-builder-descriptions">
    <script src="{:asset('qa-builder/qa-builder-descriptions.js')}"></script>
    <define name="qa-builder-descriptions" value="1" />
</notdefined>
<script>
QscmfAntd.descriptions(document.getElementById('{$id}'), {$this->genOpt()});
</script>
template;
            $this->html = (string)((new View())->fetch('', $template));
        }

        return $this->html;
    }
}