import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {Pressable} from 'react-native';
import {Dimensions} from 'react-native';

export const BlogSnap = (props) => {
  const contents = props.blog.blog_content;

  const title = contents[0].value;
  const text = contents
    .map((item) => {
      if (item.type == 'Text') {
        return `${item.value}\t`;
      }
    })
    .join(' ');
  var images = contents.filter((e) => e.type == 'Image');
  const hasImage = images.length > 0;
  const isLarge = props.large || false;

  const width = BLOG_ITEM_WIDTH * (isLarge ? 2 : 1);

  return (
    <React.Fragment>
      <Pressable
        onPress={() => props.navigate(props.target, {id: props.blog.id})}
        style={[
          styles.container,
          {width},
          isLarge && {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          props.style,
        ]}>
        <View style={{alignItems: 'flex-start'}}>
          {hasImage && (
            <GlobalStyle.UI.Image
              style={styles.image}
              source={{uri: images[0].value}}
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: BLOG_ITEM_WIDTH - BLOG_ITEM_PADDING * 2,
            }}>
            <View
              style={{
                width:
                  (BLOG_ITEM_WIDTH - BLOG_ITEM_PADDING * 2) *
                  (isLarge ? 1 : 0.7),
              }}>
              <Text
                numberOfLines={2}
                style={styles.title}
                adjustsFontSizeToFit
                minimumFontScale={0.8}>
                {props.blog.su_title || title}
              </Text>
            </View>
            <View style={{paddingBottom: BLOG_ITEM_PADDING * 1.25}}>
              {!props.dontShowBookmark && !isLarge && (
                <GlobalStyle.UI.BookmarkSnap
                  bookmarks={props.bookmarks}
                  objId={props.blog.id}
                  type={'announcement'}
                />
              )}
            </View>
          </View>
        </View>
        {isLarge && (
          <GlobalStyle.UI.Text
            numberOfLines={NUMBER_OF_TEXT_LINES}
            style={[
              styles.text,
              {width: BLOG_ITEM_WIDTH - BLOG_ITEM_PADDING * 2},
            ]}>
            {text.trim()}
          </GlobalStyle.UI.Text>
        )}
      </Pressable>
    </React.Fragment>
  );
};

BlogSnap.defaultProps = {
  showNotification: true,
  target: 'Blog Focus',
  buttonText: 'Read more',
  dontShowBookmark: false,
};
const LINE_HEIGHT = GlobalStyle.TextStyle.bodyRegular.fontSize + 3;
const TITLE_LINE_HEIGHT = GlobalStyle.TextStyle.headingRegular.fontSize + 4;
const IMAGE_HEIGHT = GlobalStyle.Measurements.unit * 5;
const BLOG_ITEM_PADDING = 6.5;

export const BLOG_ITEM_WIDTH = GlobalStyle.Measurements.width * 0.4;
export const BLOG_ITEM_HEIGHT =
  IMAGE_HEIGHT + TITLE_LINE_HEIGHT * 2 + BLOG_ITEM_PADDING * 3;
export const BLOG_CAROUSEL_WIDTH = GlobalStyle.Measurements.width;
export const BLOG_ITEM_HORIZONTAL_MARGIN = 5;

const NUMBER_OF_TEXT_LINES = Math.floor(BLOG_ITEM_HEIGHT / LINE_HEIGHT);
console.log('LINES', NUMBER_OF_TEXT_LINES);

export const styles = StyleSheet.create({
  container: {
    width: BLOG_ITEM_WIDTH,
    height: BLOG_ITEM_HEIGHT,
    borderRadius: GlobalStyle.Measurements.unit,
    padding: BLOG_ITEM_PADDING,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: GlobalStyle.Palettes.background.palette6,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  image: {
    width: BLOG_ITEM_WIDTH - BLOG_ITEM_PADDING * 2,
    height: IMAGE_HEIGHT,
    borderRadius: GlobalStyle.Measurements.unit * 0.7,
  },
  title: {
    ...GlobalStyle.TextStyle.bodyLargeBold,

    marginVertical: BLOG_ITEM_PADDING / 2,
    textAlign: 'left',
    alignSelf: 'flex-start',

    lineHeight: TITLE_LINE_HEIGHT,
    height: TITLE_LINE_HEIGHT * 2,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    textAlign: 'left',
    alignSelf: 'flex-start',

    lineHeight: LINE_HEIGHT,
  },
});
