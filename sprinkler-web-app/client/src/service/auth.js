export const logout = () => {
    return fetch('/logout', {
        method: 'post',
        credentials: 'include'
    }).then(() => {
        console.log('Logged out');
        window.location.reload();
    }).catch(() => {
        console.log('Failed to logout', arguments);
    });
};

