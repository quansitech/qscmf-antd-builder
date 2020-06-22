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




