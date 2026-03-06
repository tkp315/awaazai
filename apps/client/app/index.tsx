import { Redirect } from 'expo-router';

export default function Index(): React.JSX.Element {
  // TODO: Check auth state and redirect accordingly
  // If authenticated -> /(tabs), else -> /(auth)/login
  return <Redirect href="/(tabs)" />;
}
