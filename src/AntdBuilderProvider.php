<?php
namespace AntdBuilder;

use Bootstrap\Provider;
use Bootstrap\RegisterContainer;

class AntdBuilderProvider implements Provider {

    public function register(){
        RegisterContainer::registerHeadJs(__ROOT__. '/Public/qa-builder/qa-builder-vendor.js');
        RegisterContainer::registerSymLink(WWW_DIR . '/Public/qa-builder', __DIR__ . '/../js/dist');
    }
}