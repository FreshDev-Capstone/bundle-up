import React from "react";

declare module "react" {
  namespace JSX {
    interface ElementClass {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: any;
    }
    interface ElementChildrenAttribute {
      children: any;
    }
  }
}

declare global {
  namespace JSX {
    interface ElementClass {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: any;
    }
    interface ElementChildrenAttribute {
      children: any;
    }
  }
}

// React Native component type overrides
declare module "react-native" {
  const View: React.ComponentType<any>;
  const Text: React.ComponentType<any>;
  const Image: React.ComponentType<any>;
  const ScrollView: React.ComponentType<any>;
  const FlatList: React.ComponentType<any>;
  const TouchableOpacity: React.ComponentType<any>;
  const SafeAreaView: React.ComponentType<any>;
  const ActivityIndicator: React.ComponentType<any>;
  const Modal: React.ComponentType<any>;
}

export {};
