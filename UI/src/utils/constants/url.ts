let BackendURL: string;

switch (import.meta.env.VITE_STAGE) {
  case "merge": 
    BackendURL = "https://stagingapi4.catoff.xyz";
    break;
  case "dev": // Development environment (Staging 5)
    BackendURL = "https://stagingapi5.catoff.xyz";
    break;
  case "main": // Production environment
    BackendURL = "https://apiv2.catoff.xyz";
    break;
  case "mainnetTest": // Mainnet Test (for the 'production' branch in test environment)
    BackendURL = "https://mainnet-apiv2.catoff.xyz";
    break;
  case "mainnetProd": // Fix branch
    BackendURL = "https://mainnet-apiv2.catoff.xyz";
    break;
  default: // Default fallback for unknown or unspecified environments
    BackendURL = "https://evm-stagingapi.catoff.xyz";
    console.warn(
      `Unknown VITE_STAGE: ${import.meta.env.VITE_STAGE}, defaulting to staging`
    );
    break;
}

export { BackendURL };
