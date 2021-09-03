import { Animated } from 'react-native';
/**
 * Returns `panHandlers` used to calculate Y finger position.
 *
 * Used to support interactive dismiss on iOS, on Android `panHandlers` is an empty object.
 *
 * ⚠️ You shouldn't use this hook if you don't use interactive dismiss on iOS.
 * @example
 * // `positionY` will be passed to the `KeyboardAccessoryView` component
 * const [panHandlers, positionY] = usePanResponder()
 * ...
 * <ScrollView {...panHandlers} />
 */
export declare const usePanResponder: () => {
    panHandlers: import("react-native").GestureResponderHandlers;
    positionY: Animated.Value;
};
