import { useState, useEffect } from 'react';

// Define a type for the feature flag configuration
type FeatureFlagConfig = {
  name: string;
  isEnabled: boolean;
};

// Custom hook to manage feature flags
const useFeatureFlag = (initialFlags: FeatureFlagConfig[] = []) => {
  const [flags, setFlags] = useState<FeatureFlagConfig[]>(initialFlags);

  // Function to check if a feature is enabled
  const isFeatureEnabled = (featureName: string): boolean => {
    const feature = flags.find(flag => flag.name === featureName);
    return feature ? feature.isEnabled : false;
  };

  // Function to enable a feature
  const enableFeature = (featureName: string) => {
    setFlags(currentFlags =>
      currentFlags.map(flag =>
        flag.name === featureName ? { ...flag, isEnabled: true } : flag
      )
    );
  };

  // Function to disable a feature
  const disableFeature = (featureName: string) => {
    setFlags(currentFlags =>
      currentFlags.map(flag =>
        flag.name === featureName ? { ...flag, isEnabled: false } : flag
      )
    );
  };

  // Function to toggle a feature
  const toggleFeature = (featureName: string) => {
    setFlags(currentFlags =>
      currentFlags.map(flag =>
        flag.name === featureName ? { ...flag, isEnabled: !flag.isEnabled } : flag
      )
    );
  };

  // Load feature flags from a JSON file on mount
  useEffect(() => {
    const featureFlags: FeatureFlagConfig[] = [
        { name: "toolbar", isEnabled: true },
        { name: "system-list", isEnabled: true }
    ];
    setFlags(featureFlags);
    // }
  }, []);

  return { isFeatureEnabled, enableFeature, disableFeature, toggleFeature };
};

export default useFeatureFlag;
