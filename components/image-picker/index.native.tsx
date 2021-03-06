/* tslint:disable:jsx-no-multiline-js */
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ImagePickerPropTypes } from './PropsType';
import imagePickerStyle, { IImagePickerStyle } from './style/index.native';
import ImageRoll from './ImageRoll.native';

export interface ImagePickerNativeProps extends ImagePickerPropTypes {
  styles?: IImagePickerStyle;
}

const imagePickerStyles = StyleSheet.create<any>(imagePickerStyle);

export default class ImagePicker extends React.Component<ImagePickerNativeProps, any> {
  static defaultProps = {
    styles: imagePickerStyles,
    onChange() {},
    files: [],
    selectable: true,
  };

  plusText: any;
  plusWrap: any;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  onPressIn = () => {
    const styles = this.props.styles!;
    this.plusWrap.setNativeProps({
      style: [styles.item, styles.size, styles.plusWrapHighlight],
    });
  }

  onPressOut = () => {
    const styles = this.props.styles!;
    this.plusWrap.setNativeProps({
      style: [styles.item, styles.size, styles.plusWrapNormal],
    });
  }

  showPicker = () => {
    if (this.props.onAddImageClick) {
      this.props.onAddImageClick();
      return;
    }
    this.setState({
      visible: true,
    });
  }

  addImage(imageObj) {
    if (!imageObj.url) {
      imageObj.url = imageObj.uri;
      delete imageObj.uri;
    }
    const { files = [] } = this.props;
    const newImages = files.concat(imageObj);
    if (this.props.onChange) {
      this.props.onChange(newImages, 'add');
    }
  }

  removeImage(idx: number): void {
    const newImages: any[] = [];
    const { files = [] } = this.props;
    files.forEach((image, index) => {
      if (index !== idx) {
        newImages.push(image);
      }
    });
    if (this.props.onChange) {
      this.props.onChange(newImages, 'remove', idx);
    }
  }

  hideImageRoll = () => {
    this.setState({
      visible: false,
    });
  }

  onImageClick(index) {
    if (this.props.onImageClick) {
      this.props.onImageClick(index, this.props.files);
    }
  }

  render() {
    const { files = [], selectable } = this.props;
    const styles = this.props.styles!;
    const filesView = files.map((item: any, index) => (
      <View key={index} style={[styles.item, styles.size]}>
        <TouchableOpacity onPress={() => this.onImageClick(index)} activeOpacity={0.6}>
          <Image
            source={{ uri: item.url }}
            style={[styles.size, styles.image]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.removeImage(index)} style={styles.closeWrap} activeOpacity={0.6}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>
    ));

    const imageRollEl = (
      <ImageRoll
        onCancel={this.hideImageRoll}
        onSelected={imgObj => this.addImage(imgObj)}
      />
    );
    return (
      <View style={styles.container}>
        {filesView}
        {
          selectable && (
            <TouchableWithoutFeedback
              onPress={this.showPicker}
              onPressIn={this.onPressIn}
              onPressOut={this.onPressOut}
            >
              <View
                ref={conponent => this.plusWrap = conponent}
                style={[styles.item, styles.size, styles.plusWrap, styles.plusWrapNormal]}
              >
                <Text style={[styles.plusText]}>+</Text>
              </View>
            </TouchableWithoutFeedback>
          )
        }
        {this.state.visible ? imageRollEl : null}
      </View>
    );
  }
}
