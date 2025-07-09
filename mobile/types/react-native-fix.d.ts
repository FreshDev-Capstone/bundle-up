/// <reference types="react" />
/// <reference types="react-native" />

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Override React Native component types to be compatible with current React version
declare module "react-native" {
  import { ComponentType, ReactNode } from "react";

  // Base props interface
  interface BaseProps {
    children?: ReactNode;
    style?: any;
    [key: string]: any;
  }

  // Component type definitions that are compatible with React
  export const View: ComponentType<BaseProps>;
  export const Text: ComponentType<BaseProps>;
  export const Image: ComponentType<BaseProps>;
  export const ScrollView: ComponentType<BaseProps>;
  export const FlatList: ComponentType<BaseProps>;
  export const TouchableOpacity: ComponentType<BaseProps>;
  export const TouchableWithoutFeedback: ComponentType<BaseProps>;
  export const SafeAreaView: ComponentType<BaseProps>;
  export const ActivityIndicator: ComponentType<BaseProps>;
  export const Modal: ComponentType<BaseProps>;
  export const RefreshControl: ComponentType<BaseProps>;
  export const KeyboardAvoidingView: ComponentType<BaseProps>;
  export const Dimensions: any;
  export const StyleSheet: any;
  export const TextInput: ComponentType<BaseProps>;
  export const Button: ComponentType<BaseProps>;
  export const Alert: any;
  export const Switch: ComponentType<BaseProps>;
  export const Platform: any;
  export const Keyboard: any;
  export const useColorScheme: any;
}

// Fix for lucide-react-native icons
declare module "lucide-react-native" {
  import { ComponentType } from "react";

  export interface LucideProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
    [key: string]: any;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  export const X: LucideIcon;
  export const CirclePlus: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const User: LucideIcon;
  export const Package: LucideIcon;
  export const Settings: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const RotateCw: LucideIcon;
  export const Repeat: LucideIcon;
  export const Repeat1: LucideIcon;
  export const RotateCcw: LucideIcon;
  // Add more icons as needed
}
