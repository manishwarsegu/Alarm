import React, { Component } from 'react';
import { Button, StyleSheet, FlatList, View } from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Icon } from 'react-native-elements';
import { deleteAlarm } from '../actions/alarm';
import ReactNativeAN from 'react-native-alarm-notification';

class ListAlarms extends Component {
  keyExtractor = (item, index) => index.toString();

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
  )};

  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.props.alarms}
        renderItem={this.renderItem}
      />
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
    delete: value => {
      dispatch(deleteAlarm(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAlarms);