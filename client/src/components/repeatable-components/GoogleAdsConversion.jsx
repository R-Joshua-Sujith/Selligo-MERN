// GoogleAdsConversion.js

import React, { useEffect } from "react";

const GoogleAdsConversion = ({ conversionId, conversionLabel }) => {
  useEffect(() => {
    // Google Ads event snippet code
    const script = document.createElement("script");
    script.innerHTML = `gtag('event', 'conversion', {'send_to': '${conversionId}/${conversionLabel}'});`;
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, [conversionId, conversionLabel]);

  return null; // This component doesn't render anything
};

export default GoogleAdsConversion;
