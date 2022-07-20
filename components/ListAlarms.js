import React, { Component } from 'react';
import { Button, StyleSheet, FlatList, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import { ListItem } from 'react-native-elements';
import { addAlarm, deleteAlarm } from '../actions/alarm';
import { makeid, keyExtractor } from '../CommonUtils/CommonFunctions';
import ReactNativeAN from 'react-native-alarm-notification';
import DateTimePicker from 'react-native-modal-datetime-picker';

class ListAlarms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      i: '',
    };
  }

  showDateTimePicker = (i) => {
    this.setState({ isDateTimePickerVisible: true, i });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = datetime => {
    var currentTime = Date.now();
    if (datetime.getTime() < currentTime) {
      Alert.alert('please choose future time');
      this.hideDateTimePicker();

      return;
    }
    const fireDate = ReactNativeAN.parseDate(datetime);
    // const selectedCardIndex = this.props.alarms.findIndex(val => this.state.i === val.alarmNotifData.id);
    console.log('A date has been picked: ', fireDate, this.props.alarms)

    const alarmNotifData = {
      id: makeid(), // Required
      title: 'Alarm Ringing', // Required
      message: 'My Notification Message', // Required
      channel: 'alarm-channel', // Required. Same id as specified in MainApplication's onCreate method
      ticker: 'My Notification Ticker',
      auto_cancel: true, // default: true
      vibrate: true,
      vibration: 100, // default: 100, no vibration if vibrate: false
      small_icon: 'ic_launcher', // Required
      large_icon: 'ic_launcher',
      play_sound: true,
      sound_name: null, // Plays custom notification ringtone if sound_name: null
      color: 'red',
      schedule_once: true, // Works with ReactNativeAN.scheduleAlarm so alarm fires once
      tag: 'some_tag',
      fire_date: fireDate, // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.

      // You can add any additional data that is important for the notification
      // It will be added to the PendingIntent along with the rest of the bundle.
      // e.g.
      data: { value: datetime },
    };

    this.props.delete(this.state.i);
    this.props.add(alarmNotifData);
    ReactNativeAN.scheduleAlarm(alarmNotifData);
    this.hideDateTimePicker();
  };

  renderItem = ({ item, i }) => {
    return (
      <View style={styles.container}>
        <ListItem
          key={i}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>{item.time.toString()}</ListItem.Title>
            <ListItem.Subtitle>{item.date.toString()}</ListItem.Subtitle>
          </ListItem.Content>
          <Button
            title="Edit"
            onPress={() => {
              this.showDateTimePicker(item.value);
            }}
          />
          <Button
            title="Remove"
            color="red"
            onPress={e => {
              ReactNativeAN.deleteAlarm(Number(item.alarmNotifData.id));
              ReactNativeAN.stopAlarmSound();
              this.props.delete(item.value);
            }}
          />
        </ListItem>
      </View>
    )
  };

  render() {
    return (
      <>
        <FlatList
          keyExtractor={keyExtractor}
          data={this.props.alarms}
          renderItem={this.renderItem}
        />
        <DateTimePicker
          mode="datetime"
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  titleStyle: { fontWeight: 'bold', fontSize: 30 },
});

const mapStateToProps = state => {
  return {
    alarms: state.alarms.alarms,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    add: alarmNotifObj => {
      dispatch(addAlarm(alarmNotifObj));
    },
    delete: value => {
      dispatch(deleteAlarm(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAlarms);