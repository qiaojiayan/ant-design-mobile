/* tslint:disable:jsx-no-multiline-js */
import React from 'react';
import RMCPopupCascader from 'rmc-cascader/lib/Popup';
import RMCCascader from 'rmc-cascader/lib/Cascader';
import RMCMultiPicker from 'rmc-picker/lib/MultiPicker';
import RMCPicker from 'rmc-picker/lib/Picker';
import treeFilter from 'array-tree-filter';
import tsPropsType from './PropsType';

export interface PickerPropsType extends tsPropsType {
  pickerPrefixCls?: string;
  popupPrefixCls?: string;
}

export function getDefaultProps() {
  const defaultFormat = (values) => {
    return values.join(',');
  };
  return {
    triggerType: 'onClick',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    popupPrefixCls: 'am-picker-popup',
    format: defaultFormat,
    cols: 3,
    cascade: true,
    extra: '请选择',
    okText: '确定',
    dismissText: '取消',
    title: '',
  };
}

export default abstract class AbstractPicker extends React.Component<PickerPropsType, any> {
  protected abstract popupProps: {};
  private scrollValue: any;

  getSel = () => {
    const value = this.props.value || [];
    let treeChildren;
    if (this.props.cascade) {
      treeChildren = treeFilter(this.props.data, (c, level) => {
        return c.value === value[level];
      });
    } else {
      treeChildren = value.map((v, i) => {
        return this.props.data[i].filter(d => d.value === v)[0];
      });
    }
    return this.props.format && this.props.format(treeChildren.map((v) => {
      return v.label;
    }));
  }

  getPickerCol = () => {
    const { data, pickerPrefixCls, itemStyle, indicatorStyle } = this.props;
    return data.map((col, index) => {
      return (
        <RMCPicker
          key={index}
          prefixCls={pickerPrefixCls}
          style={{ flex: 1 }}
          itemStyle={itemStyle}
          indicatorStyle={indicatorStyle}
        >
          {col.map(item => {
            return (
              <RMCPicker.Item key={item.value} value={item.value}>
                {item.label}
              </RMCPicker.Item>
            );
          })}
        </RMCPicker>
      );
    });
  }

  onOk = (v: any) => {
    if (this.scrollValue !== undefined) {
      v = this.scrollValue;
    }
    if (this.props.onChange) {
      this.props.onChange(v);
    }
    if (this.props.onOk) {
      this.props.onOk(v);
    }
  }

  setScrollValue = (v: any) => {
    this.scrollValue = v;
  }

  fixOnOk = (cascader: any) => {
    if (cascader) {
      cascader.onOk = this.onOk;
    }
  }

  render() {
    const {
      children, value = [], extra, okText, dismissText, popupPrefixCls, itemStyle, indicatorStyle,
      cascade, prefixCls, pickerPrefixCls, data, cols, onPickerChange, onOk, ...restProps,
    } = this.props;

    let cascader;
    let popupMoreProps = {};
    if (cascade) {
      cascader = (
        <RMCCascader
          prefixCls={prefixCls}
          pickerPrefixCls={pickerPrefixCls}
          data={data}
          cols={cols}
          onChange={onPickerChange}
          onScrollChange={this.setScrollValue}
          pickerItemStyle={itemStyle}
          indicatorStyle={indicatorStyle}
        />
      );
    } else {
      cascader = (
        <RMCMultiPicker
          style={{ flexDirection: 'row', alignItems: 'center' }}
          prefixCls={prefixCls}
          onScrollChange={this.setScrollValue}
        >
          {this.getPickerCol()}
        </RMCMultiPicker>
      );
      popupMoreProps = {
        pickerValueProp: 'selectedValue',
        pickerValueChangeProp: 'onValueChange',
      };
    }
    return (
      <RMCPopupCascader
        cascader={cascader}
        {...this.popupProps}
        {...restProps}
        prefixCls={popupPrefixCls}
        value={value}
        dismissText={dismissText}
        okText={okText}
        {...popupMoreProps}
        ref={this.fixOnOk}
      >
        {children && React.cloneElement(children, { extra: this.getSel() || extra })}
      </RMCPopupCascader>
    );
  }
}
