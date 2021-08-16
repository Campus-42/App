import {Container} from './Container';
import {Button} from './Button';
import {TextInput} from './TextInput';
import {Text} from './Text';

export const Sections = {
  /**
   * The sections is meant to create a more
   * cohesive section for buttons and texts
   * throughout the app. An example of a
   * use-case is the various questions under
   * an FAQ section.
   *
   * The section is wrapped by the Container child
   * and the passed children should only those
   * available under this constant.
   */
  Container,
  Button,
  TextInput,
  Text,
};
