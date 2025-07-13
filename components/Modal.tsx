import {
  KeyboardAvoidingView,
  ModalProps,
  Modal as RNModal,
  View,
  Platform,
  Text,
} from "react-native";

type Props = ModalProps & {
  isOpen: boolean;
  withInput?: boolean;
  title?: string;
};

export const Modal = ({
  isOpen,
  withInput = true,
  title,
  children,
  ...rest
}: Props) => {
  const content = withInput ? (
    <KeyboardAvoidingView
      style={{
        backgroundColor: "#3D3C3C5B",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          borderColor: "black",
          borderWidth: 3,
          paddingHorizontal: 20,
          paddingVertical: 30,
          width: "90%", 
          maxWidth: 420, 
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        {/* Title */}
        {title?.trim() ? (
          <View style={{ marginBottom: 20, alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Gabarito",
                fontSize: 30,
                color: "black",
              }}
            >
              {title}
            </Text>
          </View>
        ) : null}

        {/* Content passed into the modal */}
        {children}
      </View>
    </KeyboardAvoidingView>
  ) : (
    <View
      style={{
        backgroundColor: "#FFFFFF11",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      {children}
    </View>
  );

  return (
    <RNModal
      visible={isOpen}
      transparent
      animationType="fade"
      statusBarTranslucent
      {...rest}
    >
      <View style={{ flex: 1 }}>{content}</View>
    </RNModal>
  );
};
