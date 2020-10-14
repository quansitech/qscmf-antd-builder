<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class CollapseBuilder implements ConvertHtml{

    protected $panels = [];

    public function addPanel($header, $content){
        array_push($this->panels, [
            'header' => $header,
            'content' => $content
        ]);
        return $this;
    }

    protected function genOpt(){
        $opt = [
            'panels' => $this->panels
        ];
        return json_encode($opt, JSON_PRETTY_PRINT);
    }

    public function __toString(){
        if(!$this->html){
            $id = Str::uuid();

            $template = <<<template
<div id="{$id}">
</div>
<notdefined name="qa-builder-divider">
    <script src="{:asset('qa-builder/qa-builder-collapse.js')}"></script>
    <define name="qa-builder-collapse" value="1" />
</notdefined>
<script>
QscmfAntd.collapse(document.getElementById('{$id}'), {$this->genOpt()});
</script>
template;
            $this->html = (string)((new View())->fetch('', $template));
        }

        return $this->html;
    }
}