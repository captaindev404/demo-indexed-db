import React, {useState, useEffect} from 'react';
import {Card, ResourceList, TextStyle, Avatar, FilterType} from '@shopify/polaris';
import {openDB} from 'idb';

export default function Messages(props) {
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState('DATE_MODIFIED_DESC');
  const [searchValue, setSearchValue] = useState('');
  const [appliedFilters, setAppliedFilters] = useState([
    {
      key: 'accountStatusFilter',
      value: 'Account enabled',
    },
  ]);

  async function handleSearchChange(searchValue) {
    console.log('search changed', searchValue);
    setSearchValue(searchValue);


    const db = await openDB('offline_db',1);
    const store = db.transaction(['customers'], 'readwrite').objectStore('customers');
    const customer = await store.index('by_name').get(searchValue);
    if(customer){
      setData([customer]);
    }
  }

  function handleFiltersChange(appliedFilters) {
    setAppliedFilters(appliedFilters);
  }

  function handleSortChange(sortValue) {
    setSortValue(sortValue);
  }

  function handleSelectionChange(items) {
    setSelectedItems(items);
  }

  function handleDeleteCustomers() {
    selectedItems.forEach(id => {
      async function deleteCustomer() {
        const db = await openDB('offline_db',1);
        const store = db.transaction(['customers'], 'readwrite').objectStore('customers');
        await store.delete(id);
        console.log('customer deleted', id);
      }

      deleteCustomer();
    });
  }

  const resourceName = {
    singular: 'customer',
    plural: 'customers',
  };
  /*const items = [
    {
      id: 341,
      url: 'customers/341',
      name: 'Mae Jemison',
      location: 'Decatur, USA',
      latestOrderUrl: 'orders/1456',
    },
    {
      id: 256,
      url: 'customers/256',
      name: 'Ellen Ochoa',
      location: 'Los Angeles, USA',
      latestOrderUrl: 'orders/1457',
    },
  ];*/
  const promotedBulkActions = [
    {
      content: 'Edit customers',
      onAction: () => console.log('Todo: implement bulk edit'),
    },
  ];
  const bulkActions = [
    {
      content: 'Add tags',
      onAction: () => console.log('Todo: implement bulk add tags'),
    },
    {
      content: 'Remove tags',
      onAction: () => console.log('Todo: implement bulk remove tags'),
    },
    {
      content: 'Delete customers',
      onAction: () => handleDeleteCustomers(),
    },
  ];
  const filters = [
    {
      key: 'orderCountFilter',
      label: 'Number of orders',
      operatorText: 'is greater than',
      type: FilterType.TextField,
    },
    {
      key: 'accountStatusFilter',
      label: 'Account status',
      operatorText: 'is',
      type: FilterType.Select,
      options: ['Enabled', 'Invited', 'Not invited', 'Declined'],
    },
  ];

  const filterControl = (
    <ResourceList.FilterControl
      filters={filters}
      appliedFilters={appliedFilters}
      onFiltersChange={handleFiltersChange}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
      additionalAction={{
        content: 'Save',
        onAction: () => console.log('New filter saved'),
      }}
    />
  );

  function renderItem(item) {

    const {id, url, name, location, latestOrderUrl} = item;
    const media = <Avatar customer size="medium" name={name}/>;
    const shortcutActions = latestOrderUrl
      ? [{content: 'View latest order', url: latestOrderUrl}]
      : null;
    return (
      <ResourceList.Item
        id={id}
        url={url}
        media={media}
        accessibilityLabel={'View details for  ' + name}
        shortcutActions={shortcutActions}
        persistActions
      >
        <h3>
          <TextStyle variation="strong">{name}</TextStyle>
        </h3>
        <div>{location}</div>
      </ResourceList.Item>
    );

  }

  useEffect(() => {
    if(searchValue !== '') {
      return;
    }
    let customers = [];

    async function loadCustomers() {
      const db = await openDB('offline_db', 1);
      const store = db.transaction('customers').objectStore('customers');
      // const results = await store.getAll();
      let cursor = await store.openCursor();

      // can be replaced by an async iterator
      while (cursor){
        customers = [...customers, cursor.value];
        cursor = await cursor.continue();
      }

      setData(customers);

    }

    loadCustomers();
  });

  return (
    <Card>
      <ResourceList
        resourceName={resourceName}
        items={data}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={handleSelectionChange}
        promotedBulkActions={promotedBulkActions}
        bulkActions={bulkActions}
        sortValue={sortValue}
        sortOptions={[
          {label: 'Newest update', value: 'DATE_MODIFIED_DESC'},
          {label: 'Oldest update', value: 'DATE_MODIFIED_ASC'},
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
        filterControl={filterControl}
      />
    </Card>
  );
}
