import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports.js';

Amplify.configure(awsExports);

const theme = {
  name: "my-theme",
  tokens: {
    colors: {
      font: {
        primary: "{colors.black}",
        secondary: "{colors.neutral.90}",
        tertiary: "{colors.neutral.80}",
        disabled: "{colors.neutral.60}",
        inverse: "{colors.white}",
      },
      brand: {
        primary: {
          10: "{colors.teal.100}",
          20: "{colors.teal.90}",
          40: "{colors.teal.80}",
          60: "{colors.teal.60}",
          80: "{colors.teal.40}",
          90: "{colors.teal.20}",
          100: "{colors.teal.10}",
        },
        secondary: {
          10: "{colors.purple.100}",
          20: "{colors.purple.90}",
          40: "{colors.purple.80}",
          60: "{colors.purple.60}",
          80: "{colors.purple.40}",
          90: "{colors.purple.20}",
          100: "{colors.purple.10}",
        },
      },
    },
  },
};

export default theme;
