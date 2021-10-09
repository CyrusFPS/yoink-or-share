import React from 'react';

const UserContext = React.createContext({ user: "John" });

export const UserProvider = UserContext.Provider

export default UserContext;