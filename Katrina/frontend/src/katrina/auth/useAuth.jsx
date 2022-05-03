import React from 'react';
import AuthContext from '../context/AuthProvider';

// provide a hook that uses auth context
const useAuth = () => {
    return React.useContext(AuthContext);
}

export default useAuth;