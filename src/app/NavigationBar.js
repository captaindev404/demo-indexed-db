import { TopBar, Card, ActionList} from '@shopify/polaris';
import React, {useState} from 'react';

export default function NavigationBar(props) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  function handleSearchChange(value) {
    setSearchText(value);

    if (value.length > 0) {
      setSearchActive(true);
    } else {
      setSearchActive(false);
    }
  }

  function handleSearchResultsDismiss() {
    setSearchActive(false);
    setSearchText('');
  }

  function toggleUserMenu() {
    setUserMenuOpen(!userMenuOpen);
  }

    const userMenuMarkup = ( <TopBar.UserMenu
      actions={[
        {
          items: [{content: 'Back to Shopify', icon: 'arrowLeft'}],
        },
        {
          items: [{content: 'Community forums'}],
        },
      ]}
      name="Dharma"
      detail="Jaded Pixel"
      initials="D"
      open={userMenuOpen}
      onToggle={toggleUserMenu}
    />);


  const searchResultsMarkup = (
    <Card>
      <ActionList
        items={[
          {content: 'Shopify help center'},
          {content: 'Community forums'},
        ]}
      />
    </Card>
  );
  const searchFieldMarkup = (
    <TopBar.SearchField
      onChange={handleSearchChange}
      value={searchText}
      placeholder="Search"
    />
  );

return (<TopBar
      showNavigationToggle={true}
      userMenu={userMenuMarkup}
      searchResultsVisible={searchActive}
      searchField={searchFieldMarkup}
      searchResults={searchResultsMarkup}
      onSearchResultsDismiss={handleSearchResultsDismiss}
      onNavigationToggle={() => {
        console.log('toggle navigation visibility');
      }}
    />);
}

