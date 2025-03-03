import React, {useEffect, useState} from 'react';
import {View, StyleSheet, type StyleProp, type ViewStyle, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

type OptionType = {
  value: string;
  label: string;
  imageUrl?: string;
  extraInfo?: string;
};

type CustomSelectProps = {
  renderItem?: any;
  options: OptionType[];
  placeholder?: string;
  onChange?: (selectedOption: OptionType | null) => void;
  value?: OptionType | null | string | number;
  label?: string;
  isSearchable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
};

const Selector: React.FC<CustomSelectProps> = ({
  options,
  placeholder = 'select option..',
  onChange,
  value,
  label,
  isSearchable = false,
  containerStyle,
  dropdownStyle,
  renderItem,
}) => {
  const getOptionById = (id: string | number | null): OptionType | null => {
    if (!id) return null;
    return options.find(option => option.value === id) || null;
  };

  const selectedValue =
    typeof value === 'string' || typeof value === 'number'
      ? getOptionById(value)
      : value;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={{fontSize: 18}}>{label}</Text>}
      <Dropdown
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        // itemContainerStyle={{
        //   fontFamily: fonts.family.global.regular,
        //   fontWeight: '500',
        // }}
        value={selectedValue?.value}
        onChange={(item: OptionType | null) => onChange?.(item)}
        search={isSearchable}
        renderItem={item =>
          renderItem ? (
            renderItem
          ) : (
            <View style={styles.itemContainer}>
              <Text>{item.label}</Text>
            </View>
          )
        }
        style={[styles.dropdown, dropdownStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    gap: 8,
  },
  dropdown: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  image: {
    width: 30,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
});

export default Selector;
