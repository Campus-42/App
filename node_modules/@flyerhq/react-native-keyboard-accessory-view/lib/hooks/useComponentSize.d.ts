import { LayoutChangeEvent } from 'react-native';
/**
 * Calculates view's width & height based on the `onLayout` event.
 * @example
 * const [onLayout, size] = useComponentSize()
 * ...
 * <View onLayout={onLayout} /> // `size` will contain the size of this view
 */
export declare const useComponentSize: () => {
    onLayout: (event: LayoutChangeEvent) => void;
    size: {
        height: number;
        width: number;
    };
};
