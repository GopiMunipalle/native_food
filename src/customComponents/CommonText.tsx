import React from 'react';
import {Text, TextStyle} from 'react-native';

interface CommonTextProps {
  text: string;
  color?: string;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  fontFamily?: string;
}

const CommonText: React.FC<CommonTextProps> = ({
  text,
  color,
  fontSize,
  align,
  fontFamily,
}) => {
  const textStyle: TextStyle = {
    color,
    fontSize,
    textAlign: align,
    fontFamily,
  };

  return <Text style={textStyle}>{text}</Text>;
};

export default CommonText;
