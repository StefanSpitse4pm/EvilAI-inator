import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { PrinterProps } from '../data/printerprops';

interface PrinterModalProps {
  printer: PrinterProps | null;
  visible: boolean;
  onClose: () => void;
  onZoomTo?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function PrinterModal({ printer, visible, onClose, onZoomTo }: PrinterModalProps) {
  if (!printer) return null;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: printer.color }]}>
              <Ionicons name={printer.icon as any} size={24} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>{printer.name}</Text>
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
            <Text style={styles.description}>{printer.description}</Text>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={20} color="#6366f1" />
          <Text style={styles.detailText}>Hours: {printer.hours}</Text>
              </View>

              <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={20} color="#6366f1" />
          <Text style={styles.detailText}>Building: {printer.building}</Text>
              </View>

              {printer.phone && (
          <View style={styles.detailRow}>
            <Ionicons name="call-outline" size={20} color="#6366f1" />
            <Text style={styles.detailText}>{printer.phone}</Text>
          </View>
              )}
            </View>

            {printer.services && printer.services.length > 0 && (
              <View style={styles.servicesSection}>
          <Text style={styles.servicesTitle}>Printer Functionaliteiten:</Text>
          {printer.services.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
              </View>
            )}
          </View>
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => {
          const url = 'https://nhlstenden.mycampusprint.nl/';
          if (Platform.OS === 'web') {
            window.open(url, '_blank');
          } else {
            Linking.openURL(url);
          }
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.ButtonText}>PrintPortal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
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
  Button: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
