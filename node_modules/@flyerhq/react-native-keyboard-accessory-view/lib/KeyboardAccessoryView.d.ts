import * as React from 'react';
import { GestureResponderHandlers, StyleProp, ViewStyle } from 'react-native';
interface Props {
    children?: React.ReactNode;
    contentContainerStyle?: StyleProp<ViewStyle>;
    contentOffsetKeyboardClosed?: number;
    contentOffsetKeyboardOpened?: number;
    renderBackground?: () => React.ReactNode;
    renderScrollable: (panHandlers: GestureResponderHandlers) => React.ReactNode;
    scrollableContainerStyle?: StyleProp<ViewStyle>;
    spaceBetweenKeyboardAndAccessoryView?: number;
    style?: StyleProp<ViewStyle>;
    useListenersOnAndroid?: boolean;
}
export declare const KeyboardAccessoryView: React.MemoExoticComponent<({ children, contentContainerStyle, contentOffsetKeyboardClosed, contentOffsetKeyboardOpened, renderBackground, renderScrollable, scrollableContainerStyle, spaceBetweenKeyboardAndAccessoryView, style, useListenersOnAndroid, }: Props) => JSX.Element>;
export {};
