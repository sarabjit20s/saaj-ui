import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Progress } from '@/registry/ui/progress';
import { Text } from '@/registry/ui/text';

export default function ProgressScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <SimpleProgress />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Custom height</Text>
        <SimpleProgress height={16} />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Indeterminate Progress</Text>
        <IndeterminateProgress />
      </View>
    </ScreenWrapper>
  );
}

function SimpleProgress({ height }: { height?: number }) {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(30), 500);
    const timer2 = setTimeout(() => setProgress(60), 1500);
    const timer3 = setTimeout(() => setProgress(100), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <ComponentPreview>
      <View style={styles.progressHeader}>
        <Text variant="labelMd">Installing</Text>
        <Text variant="bodyMd">{progress}%</Text>
      </View>
      <Progress min={0} max={100} value={progress} height={height} />
    </ComponentPreview>
  );
}

function IndeterminateProgress() {
  return (
    <ComponentPreview>
      <View style={styles.progressHeader}>
        <Text variant="labelMd">Loading...</Text>
      </View>
      <Progress value={null} />
    </ComponentPreview>
  );
}

const styles = StyleSheet.create(theme => ({
  group: {
    gap: theme.space.xl,
  },
  progressHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.space.xs,
  },
}));
