import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Dimensions,
  ScrollView 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../Authprovider.js/AuthProvider';
import { useBillingData } from './BillingDataContext';
import { onBillingDataChange } from '../../../firebaseConfiguration/FirebaseCrud';

const { width, height } = Dimensions.get('window');

const DateFilter = ({ 
  onDateChange,
  containerStyle,
  iconColor = "#333333",
  iconSize = 20,
  showLabel = false,
  label = "Filter"
}) => {
  const { user } = useAuth();
  const { setBillingData } = useBillingData();

  // Initialize with current month and year
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [tempSelectedMonth, setTempSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tempSelectedYear, setTempSelectedYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate years (current year and 4 previous years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - i);
  };

  useEffect(() => {
    if (user?.displayName) {
      onBillingDataChange(user?.displayName, handleBillingDataUpdate);
    }
  }, [user]);

  useEffect(() => {
    if (user?.displayName) {
      fetchDataFromFirebase(selectedDate.month, selectedDate.year);
    }
  }, [user, selectedDate]);

  const handleBillingDataUpdate = (billingData) => {
    if (billingData) {
      const { filteredData, totalRemainingAmount, totalReceivedAmount, totalBookings, upcomingDatesCount } = 
        filterBillingDataByMonthYear(billingData, selectedDate?.month, selectedDate?.year);

      setBillingData({
        filteredData,
        totalRemainingAmount,
        totalReceivedAmount,
        totalBookings,
        totalUpcomingDates: upcomingDatesCount,
      });
    }
  };

  const fetchDataFromFirebase = async (month, year) => {
    try {
      if (user?.displayName) {
        onBillingDataChange(user.displayName, (billingData) => {
          if (billingData) {
            const { filteredData, totalRemainingAmount, totalReceivedAmount, totalBookings, upcomingDatesCount } = 
              filterBillingDataByMonthYear(billingData, month, year);

            setBillingData({
              filteredData,
              totalRemainingAmount,
              totalReceivedAmount,
              totalBookings,
              totalUpcomingDates: upcomingDatesCount,
            });

            // Call parent callback if provided
            if (onDateChange) {
              onDateChange({ month, year }, { filteredData, totalRemainingAmount, totalReceivedAmount, totalBookings });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const filterBillingDataByMonthYear = (billingData, selectedMonth, selectedYear) => {
    const filteredData = [];
    let totalRemainingAmount = 0;
    let totalReceivedAmount = 0;
    let totalBookings = 0;
    let upcomingDatesCount = 0;

    Object.values(billingData).forEach(item => {
      const date = new Date(item.dates[0]);
      const itemMonth = date.getMonth() + 1;
      const itemYear = date.getFullYear();

      if (itemMonth === selectedMonth && itemYear === selectedYear) {
        filteredData.push(item);
        totalRemainingAmount += parseFloat(item.remainingAmount);
        totalReceivedAmount += parseFloat(item.totalReceivedAmount);
        totalBookings += calculateCurrentMonthBookings([item], selectedMonth, selectedYear);
      }

      if (isUpcomingEvent(date)) {
        upcomingDatesCount += 1;
      }
    });

    return {
      filteredData,
      totalRemainingAmount,
      totalReceivedAmount,
      totalBookings,
      upcomingDatesCount,
    };
  };

  const calculateCurrentMonthBookings = (data, selectedMonth, selectedYear) => {
    const currentDate = new Date();
    const currentMonth = selectedMonth - 1;
    const currentYear = selectedYear;

    return data.reduce((total, booking) => {
      const eventDate = new Date(booking.dates[0]);
      const bookingMonth = eventDate.getMonth();
      const bookingYear = eventDate.getFullYear();

      if (
        (bookingYear === currentYear && bookingMonth === currentMonth) ||
        eventDate > currentDate
      ) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  const isUpcomingEvent = (eventDate) => {
    const currentDate = new Date();
    eventDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return eventDate > currentDate;
  };

  const handleApplyFilter = () => {
    setSelectedDate({ month: tempSelectedMonth, year: tempSelectedYear });
    setFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    setTempSelectedMonth(currentMonth);
    setTempSelectedYear(currentYear);
    setSelectedDate({ month: currentMonth, year: currentYear });
    setFilterModalVisible(false);
  };

  const handleOpenModal = () => {
    setTempSelectedMonth(selectedDate.month);
    setTempSelectedYear(selectedDate.year);
    setFilterModalVisible(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={handleOpenModal}
      >
        <Feather name="calendar" size={iconSize} color={iconColor} />
      </TouchableOpacity>

      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={['#ffffff', '#f8f9fa']}
              style={styles.modalContent}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Month & Year</Text>
                <TouchableOpacity
                  onPress={() => setFilterModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={24} color="#333333" />
                </TouchableOpacity>
              </View>

              {/* Current Selection Display */}
              <View style={styles.currentSelection}>
                <Text style={styles.currentSelectionLabel}>Current Period:</Text>
                <Text style={styles.currentSelectionValue}>
                  {monthNames[selectedDate.month - 1]} {selectedDate.year}
                </Text>
              </View>

              {/* Month Selection */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Month</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.monthScrollView}
                >
                  {monthNames.map((month, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.monthItem,
                        tempSelectedMonth === index + 1 && styles.selectedItem
                      ]}
                      onPress={() => setTempSelectedMonth(index + 1)}
                    >
                      <Text
                        style={[
                          styles.monthText,
                          tempSelectedMonth === index + 1 && styles.selectedText
                        ]}
                      >
                        {month.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Year Selection */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Year</Text>
                <View style={styles.yearContainer}>
                  {generateYears().map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearItem,
                        tempSelectedYear === year && styles.selectedItem
                      ]}
                      onPress={() => setTempSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.yearText,
                          tempSelectedYear === year && styles.selectedText
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearFilter}
                >
                  <Text style={styles.clearButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={handleApplyFilter}
                >
                  <Text style={styles.applyButtonText}>Apply Filter</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    backgroundColor: '#f8f9fa',
    borderRadius: 22, // Perfect circle
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  labelText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: 'Roboto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: height * 0.7,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    fontFamily: 'Roboto',
  },
  closeButton: {
    padding: 4,
  },
  currentSelection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#EBF4FF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  currentSelectionLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  currentSelectionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    fontFamily: 'Roboto',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    fontFamily: 'Roboto',
  },
  monthScrollView: {
    flexDirection: 'row',
  },
  monthItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedItem: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Roboto',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  yearContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearItem: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 25,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Roboto',
  },
});

export default DateFilter;