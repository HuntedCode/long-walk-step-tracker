const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Zustand ESM files use import.meta.env which breaks Metro's web bundle.
  // Force CJS resolution for zustand on web.
  if (platform === "web" && /^zustand(\/.*)?$/.test(moduleName)) {
    return context.resolveRequest(
      { ...context, isESMImport: false },
      moduleName,
      platform,
    );
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
