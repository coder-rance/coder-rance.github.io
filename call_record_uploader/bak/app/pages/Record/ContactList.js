import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,RefreshControl,Image } from 'react-native';
import { getContactsLists } from '@app/api/record';
import { AlphabetList } from 'react-native-section-alphabet-list';
import PinyinUtil from '@app/utils/pinyin';
import { showTopMessage } from '@app/utils/toast';

const colors = {
  background: {
    light: 'white',
    dark: '#EBEEF5',
  },
  seperatorLine: '#e6ebf2',
  text: {
    dark: '#1c1b1e',
  },
  primary: '#007aff',
};

const sizes = {
  itemHeight: 40,
  headerHeight: 30,
  listHeaderHeight: 0,

  spacing: {
    small: 10,
    regular: 15,
    large: 20,
  },
};

const renderListItem = (item) => {
  // const { setCallPhone, setCallVisible } = this.props;
  return (
    <TouchableOpacity onPress={() => {
      // setCallPhone(item.phoneNumber)
      // setCallVisible(true)
    }}>
      <View style={styles.listItemContainer} >
        <View style={styles.listItemLabel}>
          <Text>{item.displayName}</Text>
        </View>
        <View style={styles.listItemLabel}>
          <Text >{item.phoneNumber}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderSectionHeader = (section) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
    </View>
  );
};

const renderCustomListHeader = () => {
  return (
    <View style={styles.listHeaderContainer}>
      {/* <Text>List Header</Text> */}
    </View>
  );
};

export const ContactList = memo(() => {
  const [contactList, setContactList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // getRemoteContacts();

  }, []);

  // 下拉刷新
  const onRefresh = () => {
      setRefreshing(true);
      getRemoteContacts();
  };

  //获取远程通讯录
  const getRemoteContacts = async () => {
    try {
      let res = await getContactsLists({});

      if (res.result == 1) {
        const contactList = res.data.map(contact => {
          const pinyin = PinyinUtil.getFirstLetter(contact.NAME);
          return {
            value: pinyin,
            displayName: contact.NAME,
            phoneNumber: contact.PHONE_NUM1 ? contact.PHONE_NUM1 : '无号码',
            key: contact.ID + contact.PHONE_NUM1 + contact.GROUP_ID
          }
        });

        setContactList(contactList);
      } else {
        showTopMessage('获取通讯录失败');
      }
    } catch (err) {
      console.log(err);
      showTopMessage('获取通讯录失败');
    }finally {
      setRefreshing(false);
    }
  }

  return (
    <View style={styles.container}>
      {
        (contactList && contactList.length === 0)
          ?
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Image
              style={{ width: 200, height: 200 }}
              resizeMode='cover'
              source={require("@app/assets/img/empty.jpg")}
            />
            <Text>下拉获取通讯录</Text>
          </ScrollView>
          :
          <AlphabetList
            style={{ flex: 1 }}
            data={contactList}
            renderCustomItem={renderListItem}
            renderCustomSectionHeader={renderSectionHeader}
            renderCustomListHeader={renderCustomListHeader}
            getItemHeight={() => sizes.itemHeight}
            sectionHeaderHeight={sizes.headerHeight}
            listHeaderHeight={sizes.listHeaderHeight}
            indexLetterStyle={{ color: colors.primary }}
          />
      }
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
  },

  listItemContainer: {
    flex: 1,
    height: sizes.itemHeight,
    paddingHorizontal: sizes.spacing.regular,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: colors.seperatorLine,
    borderTopWidth: 1,
    flexDirection: 'row'
  },

  listItemLabel: {
  },

  sectionHeaderContainer: {
    height: sizes.headerHeight,
    backgroundColor: colors.background.dark,
    justifyContent: 'center',
    paddingHorizontal: sizes.spacing.regular,
  },

  sectionHeaderLabel: {
    color: '#000',
  },

  listHeaderContainer: {
    height: sizes.listHeaderHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }, 
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});