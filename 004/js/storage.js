// Preserve the existing keys and JSON shape across upgrades.
const selectedKey = 'chii-selected-v2';
const saveKey = k => 'chii-observation-v2-' + k;
export function readSave(k) {
  try {
    return JSON.parse(localStorage.getItem(saveKey(k)) || '{}');
  }
  catch {
    return {
    };
  }
}
export function writeSave(k, data) {
  try {
    localStorage.setItem(saveKey(k), JSON.stringify(data));
  }
  catch {
    /* Keep running in memory. */
  }
}
export function removeSave(k) {
  try {
    localStorage.removeItem(saveKey(k));
  }
  catch {
    /* In-memory reset still works. */
  }
}
export function readSelected(profiles) {
  try {
    const value=localStorage.getItem(selectedKey);
    return profiles[value]?value:null;
  }
  catch {
    return null;
  }
}
export function writeSelected(k) {
  try {
    localStorage.setItem(selectedKey, k);
  }
  catch {
  }
}
