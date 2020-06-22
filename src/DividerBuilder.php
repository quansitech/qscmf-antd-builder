<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class DividerBuilder implements ConvertHtml{

    protected $title = '';

    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    public function __toString(){
        $id = Str::uuid();

        $template = <<<template
<div id="{$id}">
{$this->title}
</div>
<notdefined name="qa-builder-divider">
    <script src="/Public/qa-builder/qa-builder-divider.js"></script>
    <define name="qa-builder-divider" value="1" />
</notdefined>
<script>
QscmfAntd.divider(document.getElementById('{$id}'), {});
</script>
template;


        return (string)((new View())->fetch('', $template));
    }
}