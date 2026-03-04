function serialize(data) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint') return Number(value);
    
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    
    return value;
  }));
}

module.exports = serialize;