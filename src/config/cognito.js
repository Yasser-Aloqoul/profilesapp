// AWS Cognito Configuration
// Update these values with your actual Cognito User Pool details

const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_s95vOM1Qn",
  client_id: "2p67fjjm0d1tp8crnt2cb9ojdu",
  redirect_uri: origin + "/",
  response_type: "code",
  scope: "email openid phone",
  post_logout_redirect_uri: "https://eu-central-1s95vom1qn.auth.eu-central-1.amazoncognito.com/login?client_id=2p67fjjm0d1tp8crnt2cb9ojdu&code_challenge=u01hNsaTqRvM1Pdbb9skIFG_4I6iJBUYi4um6OFJ56U&code_challenge_method=S256&redirect_uri="+origin+ "/&response_type=code&scope=email+openid+phone&state=a913b1a7c60b4c398fffbfbbf54f2e41",
};

// Cognito domain for logout redirect
export const cognitoDomain = "https://eu-central-1s95vom1qn.auth.eu-central-1.amazoncognito.com";

// Helper function for logout redirect
export const createLogoutUrl = (logoutUri = origin + "/") => {
  return `${cognitoDomain}/logout?client_id=${cognitoAuthConfig.client_id}&logout_uri=${encodeURIComponent(logoutUri)}`;
};

//http://localhost:5173https://eu-central-1s95vom1qn.auth.eu-central-1.amazoncognito.com/login?client_id=2p67fjjm0d1tp8crnt2cb9ojdu&code_challenge=EtcOFJiX1OyQPJlhmvRm7oqcMIVzq3T6GjmH92Urb8k&code_challenge_method=S256&redirect_uri=http://localhost:5173/&response_type=code&scope=email+openid+phone&state=4a2f247ecb1b47d19b10627166d86f43