# qscmf-antd-builder
antd 控件生成器

## 安装

```php
composer require quansitech/qscmf-antd-builder
```

## 控件列表
+ [Divider](https://github.com/quansitech/qscmf-antd-builder#divider)
+ [Table](https://github.com/quansitech/qscmf-antd-builder#table)

### Divider
分割线

最简单的分割线
```php
$divider = new DividerBuilder();

echo $divider; //输出html
```

给分割线设置说明
```php
$divider = new DividerBuilder();
$divider->setTitle('这是一个标题');
echo $divider; //输出html
```

修改分割线标题位置，默认为 center，即居中
```php
// 左边
$divider = new DividerBuilder();
$divider->setTitle('这是一个左标题');
$divider->setTitlePosiition('left');
echo $divider;

// 右边
$divider = new DividerBuilder();
$divider->setTitle('这是一个右标题');
$divider->setTitlePosiition('right');
echo $divider;
```

实例化对象时设置标题和标题位置
```php
echo new DividerBuilder('标题', 'right');
```

### Table
表格

最简单的表格
```php
$table_builder = new TableBuilder();
//设置列头 title 是列标题  dataIndex对应的字段key
$table_builder->addColumn([ 'title' => 'Name', 'dataIndex' => 'name']);
$table_builder->addColumn([ 'title' => 'Age', 'dataIndex' => 'age']);
$table_builder->addColumn([ 'title' => 'Address', 'dataIndex' => 'address']);
//添加记录  key 为记录唯一标识，最好使用数据库的唯一id
//其余是记录的键值对
$table_builder->addRow(['key' => 1, 'name' => 'John Brown', 'age' => 32, 'address' => 'New York No. 1 Lake Park']);
$table_builder->addRow(['key' => 2, 'name' => 'Jim Green', 'age' => 42, 'address' => 'London No. 1 Lake Park']);
$table_builder->addRow(['key' => 3, 'name' => 'Joe Black', 'age' => 32, 'address' => 'Sidney No. 1 Lake Park']);

echo $table_builder; //输出html
```

**带有筛选条件的表格**

```php
// 创建表格及添加数据
function mockData(){
    for($i=0;$i<100;$i++){
        $data[] = [
            'id' => $i,
            'name' => 'name_'.$i,
            'nick_name' => 'nick_name_'.$i,
            'num' => $i,
            'status' => rand(0,1),
            'color' => array_rand(['R','G','B']),
            'date' => '2020',
            'date_range' => '2021-2022',
        ];
    }

    return $data;
}
    
$table_builder = new \AntdBuilder\TableBuilder();
$table_builder->addColumn([ 'title' => 'name', 'dataIndex' => 'name']);
$table_builder->addColumn([ 'title' => 'nick_name', 'dataIndex' => 'nick_name']);
$table_builder->addColumn([ 'title' => 'num', 'dataIndex' => 'num']);
$table_builder->addColumn([ 'title' => 'status', 'dataIndex' => 'status']);
$table_builder->addColumn([ 'title' => 'color', 'dataIndex' => 'color']);
$table_builder->addColumn([ 'title' => 'date', 'dataIndex' => 'date']);
$table_builder->addColumn([ 'title' => 'date_range', 'dataIndex' => 'date_range']);

$data = $this->mockData();
$list_data = $data;

foreach ($list_data as &$v){
    $temp = $v;
    $temp['key'] = $v['id'];

    $table_builder->addRow($temp);
}
```


筛选通用参数说明


| 参数 | 说明 | 类型 | 默认值 |
|:---------- |:----------|:----------|:----------|
| name | 列属性值，即data.dataIndex | string |  |
| text | 筛选项标题 | string |  |
| type | 筛选类型，可选值请看 筛选类型及其options参数说明 | string |  |
| rule | 筛选规则，可选值请看 筛选规则说明 | string |  |
| changeThenSearch | 筛选内容改变时马上筛选数据，例如选择下拉框值即筛选数据，若需要应该设置为 "1" | boolean I string | false |
| showLabel | 是否在左侧显示筛选项标题，若需要应该设置为 "1" |  boolean I string | false |
| options | 筛选项额外配置，具体请看类型说明；使用自定义筛选规则时应设置callback，具体请看类型说明中的 使用回调自定义规则 | array |  |


筛选类型及其options参数说明


+ 文本框：TableBuilder::FILTER_TYPE_INPUT
+ 下拉框单选：TableBuilder::FILTER_TYPE_SELECT
  
  | 参数 | 说明 | 类型 | 默认值 |
  |:---------- |:----------|:----------|:----------|
  | options | 选项，格式为[["value"=>"value", "label"=>"label"]] | array |  |
  | showSearch | 支持文本搜索选项，若需要应该设置为 "1" | boolean I string | false |
  | width | 宽度 | string | 100px |

+ 下拉框多选：TableBuilder::FILTER_TYPE_MULTI_SELECT

  | 参数 | 说明 | 类型 | 默认值 |
  |:---------- |:----------|:----------|:----------|
  | options | 选项，格式为[["value"=>"value", "label"=>"label"]] | array |  |
  | width | 宽度 | string | 100px |

+ 日期：TableBuilder::FILTER_TYPE_DATE
  
  | 参数 | 说明 | 类型 | 默认值 |
  |:---------- |:----------|:----------|:----------|
  | format | 设置日期格式 | string |  |
  | picker | 设置选择器类型 | string，可选值 date I week I month I quarter I year | date |

+ 日期范围：TableBuilder::FILTER_TYPE_DATE_RANGE
  
  | 参数 | 说明 | 类型 | 默认值 |
  |:---------- |:----------|:----------|:----------|
  | format | 设置日期格式 | [string,string] |  |
  | picker | 设置选择器类型 | string，可选值 date I week I month I quarter I year | date |
  | showTime | 增加时间选择功能 | boolean | false |
  | valueSeparator | 值分隔符 | string | - |


筛选规则说明


+ 模糊搜索字符串：wildcard
+ 精准搜索字符串：exact
+ 列表值处于数组内：in
+ 小于：lt
+ 小于等于：elt
+ 大于：gt
+ 大于等于：egt
+ 列表值处于数字区间：between
+ 使用回调自定义规则：callback
  ```text
  需要配置options参数，添加callback的值
  callback只需要定义 js function 的 body，默认接收的参数是：value record searchData
  function 返回的结果应为 true/false，返回false则表示需要过滤该条数据。
  
  例如需要精准匹配列表值与搜索字符串： return value === searchData;
  ```
  | 参数 | 说明 |
  |:---------- |:----------|
  | value | 列的具体值，即name的值 | 
  | record | 一行的值 |
  | searchData | 搜索内容 | 


使用说明


+ 文本模糊搜索
  ```php
  // 参数说明
  // $name
  // $text
  // $showLabel 默认为 false
  
  $table_builder->addFuzzyFilter('name', '模糊搜索');
  ```
+ 文本精准搜索
  ```php
  // 参数说明
  // $name
  // $text
  // $showLabel 默认为 false
  
  $table_builder->addExactFilter('name', '精准搜索');
  ```
+ 下拉框单选
  ```php
  $status_list = array_map(function($value){
    return ['value' => $value, 'label' => $value];
    },[0,1]);
  
  // 参数说明
  // $name
  // $text
  // $options
  // $showLabel 默认为 false
  // $showSearch 默认为 false
  // $width 默认为 null
  
  $table_builder->addSelectFilter('status', '状态', $status_list);
  ```
+ 下拉框多选
  ```php
  $status_list = array_map(function($value){
    return ['value' => $value, 'label' => $value];
    },[0,1]);
  
  // 参数说明
  // $name
  // $text
  // $options
  // $showLabel 默认为 false
  // $width 默认为 null
  
  $table_builder->addMultiSelectFilter('status', '状态多选', $status_list);
  ```
+ 日期筛选
  ```php
  
  // 参数说明
  // $name
  // $text
  // $rule
  // $picker 默认为 'date'
  // $format 默认为 ''
  // $showLabel 默认为 false
  
  $table_builder->addDateFilter('date', '年份', TableBuilder::FILTER_RULE_LT, 'year');
  ```
+ 日期范围筛选
  ```php
  // $name
  // $text
  // $rule
  // $picker 默认为 'date'
  // $format 默认为 ''
  // $showLabel 默认为 false
  
  $table_builder->addDateRangeFilter('date','年份范围', TableBuilder::FILTER_RULE_BETWEEN, 'year');
  ```
+ 自定义类型与使用回调筛选规则
  ```php
  
  // 参数说明
  // $name
  // $text
  // $type
  // $callback
  // $showLabel 默认为 false
  
  $table_builder->addSelfFilter('name','自定义精准搜索', TableBuilder::FILTER_TYPE_INPUT, 'return value === searchData;');
  ```
+ 自定义类型与筛选规则
  ```php
  
  // 请看通用参数以及对应类型参数说明使用
  
  $table_builder->addFilter(['name' => 'nick_name', 'text'=>'自定义模糊搜索', 'type' => TableBuilder::FILTER_TYPE_INPUT, 'rule' => TableBuilder::FILTER_RULE_WILDCARD, 'changeThenSearch' => false]);
  ```


**带有排序的表格**

排序参数说明

| 参数 | 说明 | 类型 | 默认值 |
|:---------- |:----------|:----------|:----------|
| name | 即data.dataIndex | string |  |
| type | 排序类型，可选值请看 排序类型及其使用说明 | string I null | null |
| options | 排序项额外配置，使用自定义排序规则时应设置callback，具体请看排序类型及其使用说明中的 使用回调函数自定义规则 | array |  |


排序类型及其使用说明


+ 默认排序，即数字的升序或者降序排序：null
  ```php
  // 参数说明
  // $name
  
  $table_builder->addDefSorter(['name' =>'num']);
  ```
+ 使用回调函数自定义规则：callback
  ```text
  需要配置options参数，添加callback的值
  callback只需要定义 js function 的 body，默认接收的参数是：rowA rowB，为比较的两个行数据。
  function 返回的结果应该是一个小于、等于或大于0的整数，当小于0时，rowA在rowB前；当大于0时rowB在rowA前；当等于0时rowA与rowB相等。
  
  例如： return rowA.num-rowB.num;
  ```
  ```php
  // 参数说明
  // $name
  // $callback
  
  $table_builder->addSelfSorter('color', "return rowA.color-rowB.color;");
  ```

### Collapse
折叠卡

最简单的折叠卡
```php
$collapse = new CollapseBuilder();
$collapse->addPanel('这是个标题1', '<p>这里可以写html</p>');
$collapse->addPanel('这是个标题2', '<p>这里可以写html</p>');
echo $collapse; //输出html
```

### Descriptions

描述列表

示例:

```php
$descriptions = new DescriptionsBuilder();
$descriptions->setBordered(true);
$descriptions->addItem('抬头', $title)
    ->addItem('纳税人识别号', $tax_code, ['span' => 2])
    ->addItem('图片', ['https://demo.test/demo.png', 'https://demo.test/demo.png'], ['type' => 'image'])
    ->addItem('html', "123 <br /> 456", ['type' => 'html']);
            
echo $descriptions;
```



函数说明:

+ setBordered 

  指定是否使用边框表格的展示方式

  | 参数     | 说明                           | 必填 | 默认值 |
  | :------- | :----------------------------- | ---- | :----- |
  | bordered | 指定是否使用边框表格的展示方式 | 否   | false  |

+ addItem

  添加展示列

  | 参数        | 说明                                                         | 必填 | 默认值                       |
  | :---------- | :----------------------------------------------------------- | ---- | :--------------------------- |
  | label       | 列标题                                                       | 是   |                              |
  | content     | 内容                                                         | 是   |                              |
  | option      | 配置                                                         | 否   | [ 'type' => '', 'span' => 0] |
  | option.type | 类型 <br />1. image 图片 content需要填写图片地址<br />    content也可以填入数组表示多图展示<br />2. html content可以输入简单的html进行信息展示 | 否   | text                         |
  | option.span | 列宽 2表示占据两列，以此类推                                 | 否   | 0                            |

