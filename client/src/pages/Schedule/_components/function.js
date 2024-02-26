export function checkProperty(obj, propertyName) {
  // Check if the object has the property directly
  if (obj?.hasOwnProperty(propertyName)) {
    if (Array.isArray(obj[propertyName])) {
      if (obj[propertyName].length > 0) {
        return { exists: true, data: obj[propertyName] };
      } else {
        return { exists: true, data: null };
      }
    } else {
      return { exists: false, data: null };
    }
  }
  // If the property is not found, return false
  return { exists: false, data: null };
}
