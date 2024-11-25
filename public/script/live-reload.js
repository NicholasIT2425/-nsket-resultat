const ws = new WebSocket(`ws://${location.host}`);
ws.onmessage = (event) => {
    if (event.data === 'reload') {
        console.log('File change detected. Reloading...');
        window.location.reload();
    }
};
