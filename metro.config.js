// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);



// Add file extensions for PDF-related assets
config.resolver.assetExts = [
    ...config.resolver.assetExts,
    'ttf', // For pdfmake fonts
    'otf',
    'pdf', // For PDF files
  ];
  
  // Ensure native modules are resolved correctly
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'js',
    'json',
    'ts',
    'tsx',
  ];
  
  // Optional: Improve Metro performance for large projects
  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });
 

module.exports = config;
