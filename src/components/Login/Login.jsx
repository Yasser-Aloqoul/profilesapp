import { Authenticator, useAuthenticator, View } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { authStatus } = useAuthenticator(context => [context.authStatus]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  return (
    <View className="auth-wrapper">
      <Authenticator>
        {() => (
          <main>
            <h1>Loading...</h1>
          </main>
        )}
      </Authenticator>
    </View>
  );
}
