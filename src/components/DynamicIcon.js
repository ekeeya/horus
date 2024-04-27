import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const DynamicIcon = props => {
  const {provider} = props;
  switch (provider) {
    case 'MaterialIcons':
      return <MaterialIcons {...props} />;

    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons {...props} />;
    case 'FontAwesome5':
      return <FontAwesome5 {...props} />;
    case 'FontAwesome':
      return <FontAwesome {...props} />;
    case 'Ionicons':
      return <Ionicons {...props} />;
    case 'Fontisto':
      return <Fontisto {...props} />;
    case 'Entypo':
      return <Entypo {...props} />;
    default:
      return <MaterialIcons {...props} />;
  }
};

export default DynamicIcon;
