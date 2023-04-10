const width = Math.min(window.innerWidth, 500);
const height = Math.min(window.innerHeight, 700);

export function openWindowHolder(url: string) {
  let win = window.open(url, 'popup', `width=${width},height=${height},top=${(window.innerHeight - height)/2},left=${(window.innerWidth - width) / 2}`);

  const id = setInterval(() => {
    if (win && win.closed) {
      win = window.open(url, 'popup', `width=${width},height=${height},top=${(window.innerHeight - height)/2},left=${(window.innerWidth - width) / 2}`);
    }
  }, 500);

  const beforeunload = () => {
    if (win) {
      win.close();
    }

    clearInterval(id);
  };

  window.addEventListener('beforeunload', beforeunload);

  return () => {
    window.removeEventListener('beforeunload', beforeunload);
    clearInterval(id);

    if (win) {
      win.close();
    }
  };
}