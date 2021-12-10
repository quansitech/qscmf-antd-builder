<?php
namespace AntdBuilder;

use Illuminate\Support\Str;
use Think\View;

class DividerBuilder implements ConvertHtml{

    protected $title = '';
    protected $html = '';
    protected $def_orientation = 'center';
    protected $title_position;

    public function __construct($title = '', $title_position = null)
    {
        if ($title){
            $this->setTitle($title);
        }
        $title_position && $this->setTitlePosiition($title_position);
    }

    public function setTitle($title){
        $this->title = $title;
        return $this;
    }

    protected function genOpt(){
        $opt = [
            'orientation' => $this->checkTitlePosition($this->title_position) ? $this->title_position : $this->def_orientation,
        ];
        return json_encode($opt, JSON_PRETTY_PRINT);
    }

    public function setTitlePosiition($position){
        $this->title_position = $position;
        return $this;
    }

    protected function checkTitlePosition($position){
        return in_array($position, ['left','right', 'center']);
    }

    public function __toString(){
        if(!$this->html){
            $id = Str::uuid();

            $template = <<<template
<div id="{$id}">
{$this->title}
</div>
<notdefined name="qa-builder-divider">
    <script src="{:asset('qa-builder/qa-builder-divider.js')}"></script>
    <define name="qa-builder-divider" value="1" />
</notdefined>
<script>
QscmfAntd.divider(document.getElementById('{$id}'), {$this->genOpt()});
</script>
template;
            $this->html = (string)((new View())->fetch('', $template));
        }

        return $this->html;
    }
}