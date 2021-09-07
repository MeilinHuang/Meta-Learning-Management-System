import React, { useState } from 'react';

export const StoreContext = React.createContext(null);

const StoreProvider = ({ children }) => {
  const [posts, setPosts] = useState([])
  const [pinnedPosts, setPinnedPosts] = useState([])
  const [showPinned, setShowPinned] = useState(true)

  const store = {
    posts: [posts, setPosts],
    pinnedPosts: [pinnedPosts, setPinnedPosts],
    showPinned: [showPinned, setShowPinned],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
