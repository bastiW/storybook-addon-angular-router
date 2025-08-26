module.exports = {
  testRegex: "(/src/.*\\.spec)\\.(jsx?|js?|tsx?|ts?)$",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      useESM: true,
      isolatedModules: true
    }]
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node", "mjs"],
  transformIgnorePatterns: [
    "node_modules/(?!(@angular|rxjs)/)"
  ],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testEnvironment: "node"
}