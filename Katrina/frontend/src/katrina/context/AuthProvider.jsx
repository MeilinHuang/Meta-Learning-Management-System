import React from 'react';

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
    // global auth information
    const [auth, setAuth] = React.useState({});
    
    /* auth data = 
        {
            email: String,
            id: int,
            name: String,
            pw: String,
            staff: boolean
        }
    */
   console.log('auth is',auth)
    return (
        // provide the auth info to all children component
        <AuthContext.Provider value={{ auth, setAuth }}>
            { children }
        </AuthContext.Provider>

    )
}

export default AuthContext;