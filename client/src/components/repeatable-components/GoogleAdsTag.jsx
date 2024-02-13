import React, { useEffect } from "react";

const GoogleAdsTag = ({ trackingId }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", trackingId);
    };

    script.onerror = () => {
      console.error(
        `Error loading Google Ads script with tracking ID: ${trackingId}`
      );
    };

    // Cleanup function
    return () => {
      // Remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, [trackingId]);

  return null; // This component doesn't render anything
};

export default GoogleAdsTag;
