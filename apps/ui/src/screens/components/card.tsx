import React from 'react';
import { Image, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { Card, CardProps } from '@/registry/ui/card';
import { TextInput, TextInputProps } from '@/registry/ui/text-input';
import { Button } from '@/registry/ui/button';
import { Text } from '@/registry/ui/text';
import { Badge } from '@/registry/ui/badge';
import { Icon } from '@/registry/ui/icon';

export default function CardScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">Soft</Text>
        <CardsGroupExample />
        <PassCardExample />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Outline</Text>
        <PassCardExample variant="outline" />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Ghost</Text>
        <LoginCardExample variant="ghost" />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">With Image</Text>
        <TravelCardExample />
        <GameCardsExample />
      </View>
    </ScreenWrapper>
  );
}

function CardsGroupExample() {
  return (
    <View style={styles.statsCardsGroup}>
      <Card size="sm" style={styles.statsCard}>
        <Card.Header style={styles.statsCardHeader}>
          <Icon name="clock" size={18} color="warning11" />
          <Card.Title color="warning11" variant="labelMd">
            Active Trials
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <Text variant="headlineMd">123</Text>
        </Card.Content>
      </Card>
      <Card size="sm" style={styles.statsCard}>
        <Card.Header style={styles.statsCardHeader}>
          <Icon name="users-round" size={18} color="primary11" />
          <Card.Title color="primary11" variant="labelMd">
            Active Users
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <Text variant="headlineMd">1,234</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

function LoginCardExample(props: CardProps) {
  return (
    <Card {...props}>
      <Card.Header>
        <Card.Title>Login to your account</Card.Title>
        <Card.Description>
          Enter your email below to login to your account
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <TextInputWithLabel label="Email" placeholder="m@example.com" />
        <TextInputWithLabel
          label="Password"
          placeholder="••••••••"
          secureTextEntry
        />
      </Card.Content>
      <Card.Footer>
        <Button>
          <Button.Text>Login</Button.Text>
        </Button>
        <Button variant="secondary">
          <Button.Text>Login with Google</Button.Text>
        </Button>
      </Card.Footer>
    </Card>
  );
}

function TextInputWithLabel({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View style={styles.textInputWithLabel}>
      <Text variant="labelSm">{label}</Text>
      <TextInput {...props} />
    </View>
  );
}

function PassCardExample(props: CardProps) {
  return (
    <Card size="md" variant="soft" {...props}>
      <Card.Header>
        <Card.Title>30 Minute Pass</Card.Title>
        <Card.Description>Use within 24 hours</Card.Description>
        <Badge style={styles.passCardActionBadge}>
          <Badge.Text variant="labelLg">$4.99</Badge.Text>
        </Badge>
      </Card.Header>
      <Card.Footer style={styles.passCardFooter}>
        <Badge variant="secondary">
          <Badge.Icon
            name="lock-open"
            color="primaryMinimalForeground"
            size={16}
          />
          <Badge.Text variant="bodySm">Unlimited rides</Badge.Text>
        </Badge>
        <Badge variant="secondary">
          <Badge.Icon name="timer" color="primaryMinimalForeground" size={16} />
          <Badge.Text variant="bodySm">30 minutes in total</Badge.Text>
        </Badge>
      </Card.Footer>
    </Card>
  );
}

function GameCardsExample() {
  const games: {
    thumbnail: string;
    title: string;
    price: string;
    free: boolean;
  }[] = [
    {
      thumbnail:
        'https://cdn1.epicgames.com/spt-assets/a55e4c8b015d445195aab2f028deace6/where-winds-meet-gd7a4.jpg?resize=1&w=360&h=480&quality=medium',
      title: 'Where Winds Meet',
      price: '0',
      free: true,
    },
    {
      thumbnail:
        'https://cdn1.epicgames.com/spt-assets/9e8b37541e614575b4de303d2c2e44cf/arc-raiders-hrxqv.jpg?resize=1&w=360&h=480&quality=medium',
      title: 'ARC Raiders',
      price: '39.99',
      free: false,
    },
  ];

  return (
    <View style={styles.gameCardsRow}>
      {games.map(item => {
        return (
          <Card
            key={item.title}
            size="sm"
            variant="ghost"
            style={styles.gameCard}
          >
            <View style={styles.gameCardImageContainer}>
              <Image
                source={{
                  uri: item.thumbnail,
                }}
                resizeMode="contain"
                alt={item.title}
                style={styles.gameCardImage}
              />
            </View>
            <Card.Header>
              <Text color="mutedForeground" variant="bodySm">
                Base Game
              </Text>
              <Card.Title variant="labelLg" numberOfLines={1}>
                {item.title}
              </Card.Title>
            </Card.Header>
            <Card.Footer style={styles.gameCardFooter}>
              <Text>{item.free ? 'Free' : '$' + item.price}</Text>
            </Card.Footer>
          </Card>
        );
      })}
    </View>
  );
}

function TravelCardExample() {
  return (
    <Card variant="ghost" size="sm" style={styles.travelCard}>
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D',
        }}
        resizeMode="cover"
        style={styles.travelCardImage}
      />
      <Card.Header>
        <View style={styles.travelCardHeader}>
          <Card.Title>Maidstone, Kent, UK</Card.Title>
          <View style={styles.travelCardRating}>
            <Icon name="star" />
            <Text>4.96</Text>
          </View>
        </View>
        <Card.Description>34 miles away</Card.Description>
        <Card.Description>Aug 31 - Sep 5</Card.Description>
      </Card.Header>
    </Card>
  );
}

const styles = StyleSheet.create(({ colors, radius, space }) => ({
  group: {
    gap: space.xl,
  },
  statsCardsGroup: {
    gap: space.xl,
    flexDirection: 'row',
  },
  statsCard: {
    flex: 1,
  },
  statsCardHeader: {
    flexDirection: 'row',
    gap: space.md,
    alignItems: 'center',
  },
  textInputWithLabel: {
    gap: space.sm,
  },
  gameCardsRow: {
    flexDirection: 'row',
    gap: space.xl,
  },
  gameCard: {
    maxWidth: '50%',
    flex: 1,
    padding: 0,
    borderRadius: radius.none,
  },
  gameCardImageContainer: {
    position: 'relative',
    aspectRatio: '3/4',
    borderRadius: radius.sm,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  gameCardImage: {
    position: 'absolute',
    top: -space.xl,
    left: -space.xl,
    right: -space.xl,
    bottom: 0,
  },
  gameCardFooter: {
    marginTop: -space.sm,
    flexDirection: 'row',
    gap: space.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passCardActionBadge: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: space.lg,
  },
  passCardFooter: {
    flexDirection: 'row',
    gap: space.lg,
  },
  travelCard: {
    padding: 0,
    borderRadius: 0,
  },
  travelCardImage: {
    width: '100%',
    aspectRatio: '1/1.05',
    borderRadius: radius.md,
    borderCurve: 'continuous',
  },
  travelCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    justifyContent: 'space-between',
  },
  travelCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
}));
