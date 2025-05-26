import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SchoolLocation } from '../data/schooldata';

interface LocationModalProps {
  location: SchoolLocation | null;
  visible: boolean;
  onClose: () => void;
  onZoomTo: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function LocationModal({ location, visible, onClose, onZoomTo }: LocationModalProps) {
  if (!location) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: location.color }]}>
                <Ionicons name={location.icon as any} size={24} color="#fff" />
              </View>
              <Text style={styles.modalTitle}>{location.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <Image
              source={require('../assets/images/nhl-stenden-1.png')}
              style={styles.locationImage}
              resizeMode="cover"
            />
            
            <View style={styles.infoSection}>
              <Text style={styles.description}>{location.description}</Text>
              
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={20} color="#6366f1" />
                  <Text style={styles.detailText}>Hours: {location.hours}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={20} color="#6366f1" />
                  <Text style={styles.detailText}>Building: {location.building}</Text>
                </View>
                
                {location.phone && (
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={20} color="#6366f1" />
                    <Text style={styles.detailText}>{location.phone}</Text>
                  </View>
                )}
              </View>

              {location.services && location.services.length > 0 && (
                <View style={styles.servicesSection}>
                  <Text style={styles.servicesTitle}>Services Available:</Text>
                  {location.services.map((service, index) => (
                    <View key={index} style={styles.serviceItem}>
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.zoomButton} onPress={onZoomTo}>
              <Ionicons name="locate" size={20} color="#fff" />
              <Text style={styles.zoomButtonText}>Zoom to Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  locationImage: {
    width: screenWidth,
    height: 200,
  },
  infoSection: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 12,
  },
  servicesSection: {
    marginTop: 10,
  },
  servicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  zoomButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  zoomButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});