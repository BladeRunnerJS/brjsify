function legacyFilePath(path) {
  return path.replace('@brjs', '@br').replace('@', '@').replace('/modules/', '/');
}

module.exports = legacyFilePath;
