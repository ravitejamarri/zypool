// components/ui/Icon.tsx
import React from 'react';
import { Feather } from '@expo/vector-icons';

interface IconProps {
  name: keyof typeof Feather.glyphMap;
  size?: number;
  color?: string;
  style?: object;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#e2e8f0', style }) => {
  return <Feather name={name} size={size} color={color} style={style} />;
};

export default Icon;
