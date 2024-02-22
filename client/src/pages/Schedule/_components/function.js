export function checkProperty(obj, propertyName) {
  // Check if the object has the property directly
  if (obj.hasOwnProperty(propertyName)) {
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

  // Iterate over the object keys
  for (let key in obj) {
    // Check if the current key's value is an object
    if (typeof obj[key] === "object") {
      // Recursively search for the property in the nested object
      const result = checkProperty(obj[key], propertyName);
      // If the property is found in the nested object, return the result
      if (result.exists) {
        return result;
      }
    }
  }

  // If the property is not found, return false
  return { exists: false, data: null };
}
