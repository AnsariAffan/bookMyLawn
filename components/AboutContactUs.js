import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Linking, 
  Dimensions,
  StatusBar,
  Alert
} from 'react-native';
import { version } from '../package.json';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const AboutContactUs = () => {
  const navigation = useNavigation();

  const handleCall = (phoneNumber) => {
    Alert.alert(
      "Make a Call",
      `Call ${phoneNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${phoneNumber}`) }
      ]
    );
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}?subject=Book My Lawn - Support Request`);
  };

  const handleSocialMedia = (platform) => {
    const urls = {
      linkedin: 'https://linkedin.com/in/affan-ansari',
      github: 'https://github.com/affanansari',
      website: 'https://bookmylawn.com'
    };
    
    if (urls[platform]) {
      Linking.openURL(urls[platform]);
    }
  };

  const ContactCard = ({ icon, title, subtitle, onPress, color = "#667EEA" }) => (
    <Animatable.View animation="fadeInUp" duration={600}>
      <TouchableOpacity
        style={styles.contactCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[`${color}15`, `${color}08`]}
          style={styles.contactIconContainer}
        >
          <Icon name={icon} size={24} color={color} />
        </LinearGradient>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{title}</Text>
          <Text style={styles.contactSubtitle}>{subtitle}</Text>
        </View>
        <Icon name="arrow-forward-ios" size={16} color="#C4C4C4" />
      </TouchableOpacity>
    </Animatable.View>
  );

  const FeatureCard = ({ icon, title, description, color }) => (
    <View style={styles.featureCard}>
      <LinearGradient
        colors={[`${color}15`, `${color}08`]}
        style={styles.featureIconContainer}
      >
        <Icon name={icon} size={28} color={color} />
      </LinearGradient>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <LinearGradient
        colors={["#667EEA", "#764BA2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About & Contact</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Section */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image source={require('../assets/icon.webp')} style={styles.logo} />
            </View>
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.heroTitle}>Book My Lawn</Text>
          <Text style={styles.heroSubtitle}>Your Trusted Lawn Care Partner</Text>
          <View style={styles.versionBadge}>
            <Icon name="verified" size={16} color="#10B981" />
            <Text style={styles.versionText}>v{version}</Text>
          </View>
        </Animatable.View>
      </LinearGradient>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* About Section */}
        <Animatable.View animation="fadeInUp" duration={600} delay={200}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={["#667EEA15", "#667EEA08"]}
                style={styles.sectionIconContainer}
              >
                <Icon name="info" size={24} color="#667EEA" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>About Us</Text>
            </View>
            
            <Text style={styles.description}>
              Welcome to <Text style={styles.brandText}>Book My Lawn</Text>! We're passionate about 
              revolutionizing lawn care services through innovative technology and exceptional user experience.
            </Text>

            <Text style={styles.description}>
              Our mission is to simplify lawn care bookings, streamline business operations, and connect 
              homeowners with trusted lawn care professionals. We believe in quality service, convenience, 
              and building lasting relationships with our community.
            </Text>

            {/* Features Grid */}
            <View style={styles.featuresContainer}>
              <FeatureCard
                icon="schedule"
                title="Easy Booking"
                description="Schedule services with just a few taps"
                color="#10B981"
              />
              <FeatureCard
                icon="verified-user"
                title="Trusted Pros"
                description="Vetted lawn care professionals"
                color="#F59E0B"
              />
              <FeatureCard
                icon="support-agent"
                title="24/7 Support"
                description="Always here when you need us"
                color="#EF4444"
              />
              <FeatureCard
                icon="eco"
                title="Eco-Friendly"
                description="Sustainable lawn care practices"
                color="#06B6D4"
              />
            </View>
          </View>
        </Animatable.View>

        {/* Contact Section */}
        <Animatable.View animation="fadeInUp" duration={600} delay={400}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={["#10B98115", "#10B98108"]}
                style={styles.sectionIconContainer}
              >
                <Icon name="contact-support" size={24} color="#10B981" />
              </LinearGradient>
              <Text style={styles.sectionTitle}>Get in Touch</Text>
            </View>

            <Text style={styles.description}>
              Have questions or need assistance? We'd love to hear from you! 
              Reach out through any of the channels below.
            </Text>

            {/* Developer Info Card */}
            <View style={styles.developerCard}>
              <LinearGradient
                colors={["#667EEA", "#764BA2"]}
                style={styles.developerAvatar}
              >
                <Icon name="person" size={32} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.developerInfo}>
                <Text style={styles.developerName}>Affan Ansari</Text>
                <Text style={styles.developerTitle}>Lead Developer & Founder</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon key={star} name="star" size={14} color="#F59E0B" />
                  ))}
                  <Text style={styles.ratingText}>5.0 Developer</Text>
                </View>
              </View>
            </View>

            {/* Contact Methods */}
            <View style={styles.contactMethods}>
              <ContactCard
                icon="phone"
                title="Call Us"
                subtitle="+91 9579564688"
                onPress={() => handleCall('9579564688')}
                color="#10B981"
              />
              
              <ContactCard
                icon="email"
                title="Email Support"
                subtitle="mohammadaffan777@gmail.com"
                onPress={() => handleEmail('mohammadaffan777@gmail.com')}
                color="#667EEA"
              />
              
              <ContactCard
                icon="message"
                title="WhatsApp"
                subtitle="Quick support via WhatsApp"
                onPress={() => Linking.openURL('https://wa.me/919579564688')}
                color="#25D366"
              />
            </View>
          </View>
        </Animatable.View>

        {/* Social Links */}
        <Animatable.View animation="fadeInUp" duration={600} delay={600}>
          <View style={styles.socialSection}>
            <Text style={styles.socialTitle}>Connect With Us</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#0077B515' }]}
                onPress={() => handleSocialMedia('linkedin')}
              >
                <Icon name="work" size={24} color="#0077B5" />
                <Text style={[styles.socialButtonText, { color: '#0077B5' }]}>LinkedIn</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#33333315' }]}
                onPress={() => handleSocialMedia('github')}
              >
                <Icon name="code" size={24} color="#333333" />
                <Text style={[styles.socialButtonText, { color: '#333333' }]}>GitHub</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: '#667EEA15' }]}
                onPress={() => handleSocialMedia('website')}
              >
                <Icon name="language" size={24} color="#667EEA" />
                <Text style={[styles.socialButtonText, { color: '#667EEA' }]}>Website</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for better lawn care experience
          </Text>
          <Text style={styles.copyrightText}>
            © 2024 Book My Lawn. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logoWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
    padding: 15,
    zIndex: 2,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  logoGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Roboto',
    marginBottom: 16,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    gap: 6,
  },
  versionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    fontFamily: 'Roboto',
    marginBottom: 16,
  },
  brandText: {
    color: '#667EEA',
    fontWeight: '600',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Roboto',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  developerCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  developerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  developerTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: 'Roboto',
  },
  contactMethods: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Roboto',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  socialSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Roboto',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
});

export default AboutContactUs;