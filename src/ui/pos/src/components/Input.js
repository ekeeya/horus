import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';

const Input = props => {
  const {leftIcon, rightIcon, label} = props;
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const renderIcon = icon => {
    return icon;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelText}>{label}</Text>
      <View style={[styles.inputContainer, isFocused && styles.focusedBorder]}>
        {renderIcon(leftIcon)}
        <TextInput
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={styles.input}
          {...props}
          placeholderTextColor="gray"
        />
        {renderIcon(rightIcon)}
      </View>
      {props.notice && <Text style={styles.noticeStyle}>{props.notice}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2f8', // Light blue input area
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaf2f8', // Border same color as input area background
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  focusedBorder: {
    borderColor: '#167D7F', // Borders turn blue on focus
  },
  icon: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    color: 'black',
    paddingVertical: 10,
    fontSize: 16,
  },
  labelText: {
    fontWeight: '500',
  },
  noticeStyle: {
    fontSize: 10,
  },
});
export default Input;
