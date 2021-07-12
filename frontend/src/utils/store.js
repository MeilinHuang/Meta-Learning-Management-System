import React, { useState } from 'react';

export const StoreContext = React.createContext(null);

const StoreProvider = ({ children }) => {
  const [posts, setPosts] = useState([])

  const store = {
    posts: [posts, setPosts],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
